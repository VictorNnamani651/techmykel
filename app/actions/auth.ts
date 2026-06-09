"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { referrals, users } from "@/lib/db/schema";
import { hashSecret, verifySecret } from "@/lib/password";
import { createAndSendOtp, verifyOtp } from "@/lib/otp";
import { createSession, destroySession } from "@/lib/session";
import {
  loginSchema,
  otpSchema,
  registerSchema,
} from "@/lib/validation";

export type FormState =
  | { error?: string; fieldErrors?: Record<string, string[] | undefined> }
  | undefined;

function home(role: "admin" | "referrer") {
  return role === "admin" ? "/admin" : "/dashboard";
}

export async function register(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const { fullName, phone, password } = parsed.data;

  const [existing] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
  if (existing?.phoneVerifiedAt) {
    return { error: "An account with this phone number already exists. Please log in." };
  }

  const passwordHash = await hashSecret(password);

  // Converted Referrer (ADR-0005): link back if this phone was once referred.
  const [priorReferral] = await db
    .select({ id: referrals.id })
    .from(referrals)
    .where(eq(referrals.referredPhone, phone))
    .limit(1);
  const convertedFromReferralId = priorReferral?.id ?? null;

  if (existing) {
    // Unverified account — let them resume / reset before verification.
    await db
      .update(users)
      .set({ fullName, passwordHash, convertedFromReferralId })
      .where(eq(users.id, existing.id));
  } else {
    await db.insert(users).values({
      role: "referrer",
      fullName,
      phone,
      passwordHash,
      convertedFromReferralId,
    });
  }

  await createAndSendOtp(phone, "registration");
  redirect(`/register/verify?phone=${encodeURIComponent(phone)}`);
}

export async function verifyRegistration(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = otpSchema.safeParse({
    phone: formData.get("phone"),
    code: formData.get("code"),
  });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const { phone, code } = parsed.data;
  const [user] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
  if (!user) {
    return { error: "No pending registration for this number. Please register again." };
  }

  const result = await verifyOtp(phone, code, "registration");
  if (!result.ok) return { error: result.message };

  if (!user.phoneVerifiedAt) {
    await db.update(users).set({ phoneVerifiedAt: new Date() }).where(eq(users.id, user.id));
  }
  await createSession(user.id, user.role);
  redirect(home(user.role));
}

export async function resendRegistrationOtp(formData: FormData): Promise<void> {
  const phone = otpSchema.shape.phone.safeParse(formData.get("phone"));
  if (phone.success) {
    const [user] = await db.select().from(users).where(eq(users.phone, phone.data)).limit(1);
    if (user && !user.phoneVerifiedAt) await createAndSendOtp(phone.data, "registration");
  }
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    phone: formData.get("phone"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const { phone, password } = parsed.data;
  const [user] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
  if (!user || !(await verifySecret(password, user.passwordHash))) {
    return { error: "Invalid phone number or password." };
  }

  // Phone never verified — push them through OTP before issuing a session.
  if (!user.phoneVerifiedAt) {
    await createAndSendOtp(phone, "registration");
    redirect(`/register/verify?phone=${encodeURIComponent(phone)}`);
  }

  await createSession(user.id, user.role);
  redirect(home(user.role));
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/login");
}
