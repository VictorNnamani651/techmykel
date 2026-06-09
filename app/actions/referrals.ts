"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { referrals, users } from "@/lib/db/schema";
import { requireReferrer } from "@/lib/dal";
import { referralSchema } from "@/lib/validation";
import { writeAudit } from "@/lib/audit";
import { notify } from "@/lib/notifications";

export type ReferralFormState =
  | { error?: string; fieldErrors?: Record<string, string[] | undefined> }
  | undefined;

async function notifyAdmins(message: string, entityId: string) {
  const admins = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.role, "admin"));
  await Promise.all(
    admins.map((a) =>
      notify({
        userId: a.id,
        type: "admin.referral_created",
        entityType: "referral",
        entityId,
        message,
      }),
    ),
  );
}

export async function createReferral(
  _prev: ReferralFormState,
  formData: FormData,
): Promise<ReferralFormState> {
  const session = await requireReferrer();

  const parsed = referralSchema.safeParse({
    referredName: formData.get("referredName"),
    referredPhone: formData.get("referredPhone"),
    note: formData.get("note"),
  });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const { referredName, referredPhone, note } = parsed.data;

  // Anti-farming (ADR-0005): referred phone must not equal ANY user phone.
  const [asUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.phone, referredPhone))
    .limit(1);
  if (asUser) {
    return {
      fieldErrors: {
        referredPhone: [
          asUser.id === session.userId
            ? "You can't refer your own number."
            : "This number belongs to a registered referrer and can't be referred.",
        ],
      },
    };
  }

  // Referred once, ever (ADR-0004).
  const [existing] = await db
    .select({ id: referrals.id })
    .from(referrals)
    .where(eq(referrals.referredPhone, referredPhone))
    .limit(1);
  if (existing) {
    return {
      fieldErrors: { referredPhone: ["This customer has already been referred."] },
    };
  }

  let created: { id: string };
  try {
    [created] = await db
      .insert(referrals)
      .values({
        referrerId: session.userId,
        referredName,
        referredPhone,
        note: note || null,
      })
      .returning({ id: referrals.id });
  } catch {
    // unique-index race on referred_phone
    return {
      fieldErrors: { referredPhone: ["This customer has already been referred."] },
    };
  }

  await writeAudit({
    actorUserId: session.userId,
    actorRole: "referrer",
    action: "referral.created",
    entityType: "referral",
    entityId: created.id,
    toState: "unverified",
    metadata: { referredName, referredPhone },
  });
  await notifyAdmins(`New referral submitted: ${referredName}.`, created.id);

  redirect(`/referrals/${created.id}`);
}
