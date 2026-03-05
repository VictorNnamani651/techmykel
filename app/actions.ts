"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ─── Register a new user ──────────────────────────────────────────────────────
export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;

  if (!name || !phone || !password) {
    throw new Error("Missing required fields.");
  }

  const existing = await prisma.user.findUnique({
    where: { phoneNumber: phone.trim() },
  });

  if (existing) {
    throw new Error("Phone number already registered.");
  }

  const bcrypt = require("bcryptjs");
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      phoneNumber: phone.trim(),
      password: hashedPassword,
      role: "REFERRER",
    },
  });
}

// ─── Create a new RewardConfig ────────────────────────────────────────────────
export async function createRewardConfig(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const rewardType = formData.get("rewardType") as "CASH" | "AIRTIME" | "DATA";
  const value = parseInt(formData.get("value") as string, 10);

  if (!title || !rewardType || isNaN(value) || value <= 0) {
    throw new Error("Invalid reward config data.");
  }

  await prisma.rewardConfig.create({
    data: { title, rewardType, value, isActive: true },
  });

  revalidatePath("/admin/rewards");
  redirect("/admin/rewards");
}

// ─── Toggle RewardConfig active state ────────────────────────────────────────
export async function toggleRewardConfig(id: string, isActive: boolean) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  await prisma.rewardConfig.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/rewards");
}

// ─── Create a new Referral ────────────────────────────────────────────────────
export async function createReferral(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  const referrerPhone = (formData.get("referrerPhone") as string).trim();
  const customerName = (formData.get("customerName") as string).trim();
  const customerPhone =
    (formData.get("customerPhone") as string | null)?.trim() || null;
  const rewardConfigId = formData.get("rewardConfigId") as string;

  if (!referrerPhone || !customerName || !rewardConfigId) {
    throw new Error("Missing required fields.");
  }

  // Look up referrer by phone
  const referrer = await prisma.user.findUnique({
    where: { phoneNumber: referrerPhone },
  });
  if (!referrer) throw new Error("Referrer not found with that phone number.");
  if (referrer.role !== "REFERRER")
    throw new Error("That user is not a registered referrer.");

  await prisma.referral.create({
    data: {
      referrerId: referrer.id,
      customerName,
      customerPhone: customerPhone || undefined,
      rewardConfigId,
      status: "PENDING",
    },
  });

  revalidatePath("/admin/referrals");
  revalidatePath("/admin");
  redirect("/admin/referrals");
}

// ─── Update referral status ───────────────────────────────────────────────────
export async function updateReferralStatus(
  id: string,
  status: "SUCCESSFUL" | "FAILED",
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  await prisma.referral.update({ where: { id }, data: { status } });

  revalidatePath(`/admin/referrals/${id}`);
  revalidatePath("/admin/referrals");
  revalidatePath("/admin");
}

// ─── Request redemption (referrer action) ─────────────────────────────────────
export async function requestRedemption(referralId: string) {
  const session = await auth();
  if (!session || session.user.role !== "REFERRER")
    throw new Error("Unauthorized");

  // Ensure the referral belongs to this user and is SUCCESSFUL
  const referral = await prisma.referral.findFirst({
    where: {
      id: referralId,
      referrerId: session.user.id,
      status: "SUCCESSFUL",
    },
    include: { redemption: true },
  });
  if (!referral) throw new Error("Referral not found or not eligible.");
  if (referral.redemption) throw new Error("Redemption already requested.");

  await prisma.redemption.create({ data: { referralId, status: "REQUESTED" } });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/referrals");
}

// ─── Fulfill a redemption (admin action) ─────────────────────────────────────
export async function fulfillRedemption(redemptionId: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  await prisma.redemption.update({
    where: { id: redemptionId },
    data: { status: "FULFILLED" },
  });

  revalidatePath("/admin/redemptions");
  revalidatePath("/admin");
}
