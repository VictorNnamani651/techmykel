"use server";

import { redirect } from "next/navigation";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { redemptions, referrals, users } from "@/lib/db/schema";
import { requireReferrer } from "@/lib/dal";
import { redeemSchema } from "@/lib/validation";
import { writeAudit } from "@/lib/audit";
import { formatNgPhone } from "@/lib/phone";
import { notifyAdmins } from "@/lib/notifications";

export type RedeemState =
  | { error?: string; fieldErrors?: Record<string, string[] | undefined> }
  | undefined;

export async function redeemReferral(
  _prev: RedeemState,
  formData: FormData,
): Promise<RedeemState> {
  const session = await requireReferrer();
  const referralId = String(formData.get("referralId") ?? "");

  // Only the fields for the chosen reward type are rendered, so unmounted
  // inputs arrive as null and the discriminated union ignores them.
  const parsed = redeemSchema.safeParse({
    rewardType: formData.get("rewardType"),
    destinationBankName: formData.get("destinationBankName") ?? undefined,
    destinationAccountNumber: formData.get("destinationAccountNumber") ?? undefined,
    destinationAccountName: formData.get("destinationAccountName") ?? undefined,
    destinationPhone: formData.get("destinationPhone") ?? undefined,
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const input = parsed.data;

  // Reward Destination snapshot (ADR-0011): frozen onto this redemption so the
  // record of where money went survives the referrer editing their defaults.
  const destination =
    input.rewardType === "cash"
      ? {
          destinationBankName: input.destinationBankName,
          destinationAccountNumber: input.destinationAccountNumber,
          destinationAccountName: input.destinationAccountName,
        }
      : { destinationPhone: input.destinationPhone };

  const [referral] = await db
    .select()
    .from(referrals)
    .where(and(eq(referrals.id, referralId), eq(referrals.referrerId, session.userId)))
    .limit(1);

  if (!referral) return { error: "Referral not found." };
  if (referral.status !== "successful") {
    return { error: "This referral isn't ready to redeem yet." };
  }

  // At most one active (requested|fulfilled) redemption per referral.
  const active = await db
    .select({ id: redemptions.id })
    .from(redemptions)
    .where(
      and(
        eq(redemptions.referralId, referralId),
        inArray(redemptions.status, ["requested", "fulfilled"]),
      ),
    )
    .limit(1);
  if (active.length) return { error: "This reward has already been redeemed." };

  let created: { id: string };
  try {
    [created] = await db
      .insert(redemptions)
      .values({ referralId, rewardType: input.rewardType, ...destination })
      .returning({ id: redemptions.id });
  } catch {
    return { error: "This reward has already been redeemed." };
  }

  // Reuse next time. Bank details only: saving the phone would turn a one-off
  // "send it to my friend" into the silent default for every future reward.
  if (input.rewardType === "cash") {
    await db
      .update(users)
      .set({
        destinationBankName: input.destinationBankName,
        destinationAccountNumber: input.destinationAccountNumber,
        destinationAccountName: input.destinationAccountName,
      })
      .where(eq(users.id, session.userId));
  }

  await writeAudit({
    actorUserId: session.userId,
    actorRole: "referrer",
    action: "redemption.requested",
    entityType: "redemption",
    entityId: created.id,
    toState: "requested",
    metadata: {
      referralId,
      rewardType: input.rewardType,
      amount: referral.rewardAmount,
    },
  });
  const [requester] = await db
    .select({ fullName: users.fullName, phone: users.phone })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);
  const asker = requester
    ? `${requester.fullName} (${formatNgPhone(requester.phone)})`
    : "A referrer";
  const amount = referral.rewardAmount;

  await notifyAdmins({
    type: "admin.redemption_requested",
    entityType: "redemption",
    entityId: created.id,
    message: `Redemption requested (${input.rewardType}) for ${referral.referredName}.`,
    alertText: [
      "NEW REWARD REQUEST",
      "",
      `${asker} wants to collect a reward:`,
      "",
      `Reward type: ${input.rewardType}`,
      ...(amount ? [`Amount: NGN ${amount.toLocaleString("en-NG")}`] : []),
      `For referring: ${referral.referredName}`,
      "",
      ...(input.rewardType === "cash"
        ? [
            "Send the cash to:",
            `Bank: ${input.destinationBankName}`,
            `Account number: ${input.destinationAccountNumber}`,
            `Account name: ${input.destinationAccountName}`,
          ]
        : [
            `Send it to: ${formatNgPhone(input.destinationPhone)}`,
            ...(input.destinationPhone === requester?.phone
              ? []
              : ["(NOT their registered number)"]),
          ]),
    ].join("\n"),
  });

  redirect("/redemptions?toast=redemption_requested");
}

export async function cancelRedemption(formData: FormData): Promise<void> {
  const session = await requireReferrer();
  const redemptionId = String(formData.get("redemptionId") ?? "");

  const [row] = await db
    .select({
      id: redemptions.id,
      status: redemptions.status,
      referralId: redemptions.referralId,
      referrerId: referrals.referrerId,
    })
    .from(redemptions)
    .innerJoin(referrals, eq(redemptions.referralId, referrals.id))
    .where(eq(redemptions.id, redemptionId))
    .limit(1);

  if (!row || row.referrerId !== session.userId || row.status !== "requested") {
    return;
  }

  await db
    .update(redemptions)
    .set({ status: "cancelled", resolvedAt: new Date() })
    .where(eq(redemptions.id, redemptionId));

  await writeAudit({
    actorUserId: session.userId,
    actorRole: "referrer",
    action: "redemption.cancelled",
    entityType: "redemption",
    entityId: redemptionId,
    fromState: "requested",
    toState: "cancelled",
  });

  redirect("/redemptions?toast=redemption_cancelled");
}
