"use server";

import { redirect } from "next/navigation";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { redemptions, referrals, users } from "@/lib/db/schema";
import { requireReferrer } from "@/lib/dal";
import { redeemSchema } from "@/lib/validation";
import { writeAudit } from "@/lib/audit";
import { notify } from "@/lib/notifications";

export type RedeemState = { error?: string } | undefined;

async function notifyAdmins(message: string, entityId: string) {
  const admins = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.role, "admin"));
  await Promise.all(
    admins.map((a) =>
      notify({
        userId: a.id,
        type: "admin.redemption_requested",
        entityType: "redemption",
        entityId,
        message,
      }),
    ),
  );
}

export async function redeemReferral(
  _prev: RedeemState,
  formData: FormData,
): Promise<RedeemState> {
  const session = await requireReferrer();
  const referralId = String(formData.get("referralId") ?? "");

  const parsed = redeemSchema.safeParse({ rewardType: formData.get("rewardType") });
  if (!parsed.success) return { error: "Please choose how you'd like to be paid." };

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
      .values({ referralId, rewardType: parsed.data.rewardType })
      .returning({ id: redemptions.id });
  } catch {
    return { error: "This reward has already been redeemed." };
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
      rewardType: parsed.data.rewardType,
      amount: referral.rewardAmount,
    },
  });
  await notifyAdmins(
    `Redemption requested (${parsed.data.rewardType}) for ${referral.referredName}.`,
    created.id,
  );

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
