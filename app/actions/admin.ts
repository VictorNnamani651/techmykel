"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { redemptions, referrals, users } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/dal";
import { writeAudit } from "@/lib/audit";
import { notify } from "@/lib/notifications";
import { hashSecret } from "@/lib/password";
import { verifyReferralSchema } from "@/lib/validation";

export type AdminState =
  | { error?: string; fieldErrors?: Record<string, string[] | undefined>; ok?: string }
  | undefined;

const ngn = (n: number) => `₦${n.toLocaleString("en-NG")}`;

async function loadReferral(id: string) {
  const [row] = await db
    .select({
      id: referrals.id,
      status: referrals.status,
      referrerId: referrals.referrerId,
      referredName: referrals.referredName,
      rewardAmount: referrals.rewardAmount,
    })
    .from(referrals)
    .where(eq(referrals.id, id))
    .limit(1);
  return row ?? null;
}

function refresh(id?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/referrals");
  if (id) revalidatePath(`/admin/referrals/${id}`);
}

// --- Referral lifecycle ---

export async function verifyReferral(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const session = await requireAdmin();
  const id = String(formData.get("referralId") ?? "");
  const parsed = verifyReferralSchema.safeParse({ rewardAmount: formData.get("rewardAmount") });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const ref = await loadReferral(id);
  if (!ref) return { error: "Referral not found." };
  if (ref.status !== "unverified") return { error: "This referral has already been verified." };

  const amount = parsed.data.rewardAmount;
  await db
    .update(referrals)
    .set({ status: "pending", rewardAmount: amount, verifiedAt: new Date() })
    .where(eq(referrals.id, id));

  await writeAudit({
    actorUserId: session.userId,
    actorRole: "admin",
    action: "referral.verified",
    entityType: "referral",
    entityId: id,
    fromState: "unverified",
    toState: "pending",
    metadata: { amount },
  });
  await notify({
    userId: ref.referrerId,
    type: "referrer.referral_verified",
    entityType: "referral",
    entityId: id,
    message: `Your referral for ${ref.referredName} was verified — reward ${ngn(amount)}.`,
  });

  refresh(id);
  return { ok: "Referral verified." };
}

export async function editRewardAmount(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const session = await requireAdmin();
  const id = String(formData.get("referralId") ?? "");
  const parsed = verifyReferralSchema.safeParse({ rewardAmount: formData.get("rewardAmount") });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const ref = await loadReferral(id);
  if (!ref) return { error: "Referral not found." };
  if (ref.status !== "pending") return { error: "The reward can only be edited while pending." };

  const amount = parsed.data.rewardAmount;
  await db.update(referrals).set({ rewardAmount: amount }).where(eq(referrals.id, id));

  await writeAudit({
    actorUserId: session.userId,
    actorRole: "admin",
    action: "referral.amount_edited",
    entityType: "referral",
    entityId: id,
    metadata: { amount, previous: ref.rewardAmount },
  });
  await notify({
    userId: ref.referrerId,
    type: "referrer.reward_updated",
    entityType: "referral",
    entityId: id,
    message: `The reward for ${ref.referredName} was updated to ${ngn(amount)}.`,
  });

  refresh(id);
  return { ok: "Reward updated." };
}

export async function markSuccessful(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const id = String(formData.get("referralId") ?? "");
  const ref = await loadReferral(id);
  if (!ref || ref.status !== "pending") return;

  await db.update(referrals).set({ status: "successful" }).where(eq(referrals.id, id));
  await writeAudit({
    actorUserId: session.userId,
    actorRole: "admin",
    action: "referral.successful",
    entityType: "referral",
    entityId: id,
    fromState: "pending",
    toState: "successful",
  });
  await notify({
    userId: ref.referrerId,
    type: "referrer.referral_successful",
    entityType: "referral",
    entityId: id,
    message: `Your referral for ${ref.referredName} is now successful — redeem your reward.`,
  });
  refresh(id);
}

export async function markFailed(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const session = await requireAdmin();
  const id = String(formData.get("referralId") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  if (!reason) return { fieldErrors: { reason: ["Please provide a reason."] } };

  const ref = await loadReferral(id);
  if (!ref) return { error: "Referral not found." };
  if (ref.status !== "pending") return { error: "Only pending referrals can be marked failed." };

  await db.update(referrals).set({ status: "failed", reason }).where(eq(referrals.id, id));
  await writeAudit({
    actorUserId: session.userId,
    actorRole: "admin",
    action: "referral.failed",
    entityType: "referral",
    entityId: id,
    fromState: "pending",
    toState: "failed",
    metadata: { reason },
  });
  await notify({
    userId: ref.referrerId,
    type: "referrer.referral_failed",
    entityType: "referral",
    entityId: id,
    message: `Your referral for ${ref.referredName} did not go through.`,
  });
  refresh(id);
  return { ok: "Referral marked failed." };
}

export async function rejectReferral(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const session = await requireAdmin();
  const id = String(formData.get("referralId") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  if (!reason) return { fieldErrors: { reason: ["Please choose a reason."] } };

  const ref = await loadReferral(id);
  if (!ref) return { error: "Referral not found." };
  if (ref.status !== "unverified") return { error: "Only unverified referrals can be rejected." };

  await db.update(referrals).set({ status: "rejected", reason }).where(eq(referrals.id, id));
  await writeAudit({
    actorUserId: session.userId,
    actorRole: "admin",
    action: "referral.rejected",
    entityType: "referral",
    entityId: id,
    fromState: "unverified",
    toState: "rejected",
    metadata: { reason },
  });
  await notify({
    userId: ref.referrerId,
    type: "referrer.referral_rejected",
    entityType: "referral",
    entityId: id,
    message: `Your referral for ${ref.referredName} was not approved.`,
  });
  refresh(id);
  return { ok: "Referral rejected." };
}

// --- Redemption fulfilment ---

async function loadRedemption(id: string) {
  const [row] = await db
    .select({
      id: redemptions.id,
      status: redemptions.status,
      rewardType: redemptions.rewardType,
      referralId: redemptions.referralId,
      referrerId: referrals.referrerId,
      referredName: referrals.referredName,
    })
    .from(redemptions)
    .innerJoin(referrals, eq(redemptions.referralId, referrals.id))
    .where(eq(redemptions.id, id))
    .limit(1);
  return row ?? null;
}

export async function fulfilRedemption(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const id = String(formData.get("redemptionId") ?? "");
  const r = await loadRedemption(id);
  if (!r || r.status !== "requested") return;

  await db
    .update(redemptions)
    .set({ status: "fulfilled", resolvedAt: new Date() })
    .where(eq(redemptions.id, id));
  await writeAudit({
    actorUserId: session.userId,
    actorRole: "admin",
    action: "redemption.fulfilled",
    entityType: "redemption",
    entityId: id,
    fromState: "requested",
    toState: "fulfilled",
    metadata: { rewardType: r.rewardType },
  });
  await notify({
    userId: r.referrerId,
    type: "referrer.redemption_fulfilled",
    entityType: "redemption",
    entityId: id,
    message: `Your ${r.rewardType} redemption for ${r.referredName} was fulfilled. Enjoy!`,
  });
  revalidatePath("/admin/redemptions");
  revalidatePath("/admin");
}

export async function declineRedemption(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const session = await requireAdmin();
  const id = String(formData.get("redemptionId") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  if (!reason) return { fieldErrors: { reason: ["Please provide a reason."] } };

  const r = await loadRedemption(id);
  if (!r) return { error: "Redemption not found." };
  if (r.status !== "requested") return { error: "This redemption is no longer open." };

  await db
    .update(redemptions)
    .set({ status: "declined", declineReason: reason, resolvedAt: new Date() })
    .where(eq(redemptions.id, id));
  await writeAudit({
    actorUserId: session.userId,
    actorRole: "admin",
    action: "redemption.declined",
    entityType: "redemption",
    entityId: id,
    fromState: "requested",
    toState: "declined",
    metadata: { reason },
  });
  await notify({
    userId: r.referrerId,
    type: "referrer.redemption_declined",
    entityType: "redemption",
    entityId: id,
    message: `Your ${r.rewardType} redemption for ${r.referredName} was declined: ${reason}`,
  });
  revalidatePath("/admin/redemptions");
  revalidatePath("/admin");
  return { ok: "Redemption declined." };
}

// --- Referrer admin-assisted password reset (ADR-0001) ---

export async function resetReferrerPassword(_prev: AdminState, formData: FormData): Promise<AdminState> {
  await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) {
    return { fieldErrors: { password: ["Temporary password must be at least 8 characters."] } };
  }

  const [target] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!target || target.role !== "referrer") return { error: "Referrer not found." };

  await db
    .update(users)
    .set({ passwordHash: await hashSecret(password) })
    .where(eq(users.id, userId));

  await notify({
    userId,
    type: "referrer.password_reset",
    message: "Your password was reset by the shop. Please sign in with the new password.",
  });

  revalidatePath("/admin/referrers");
  return { ok: "Password reset." };
}
