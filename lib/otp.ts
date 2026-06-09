import "server-only";
import { randomInt } from "node:crypto";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { otpCodes } from "@/lib/db/schema";
import { hashSecret, verifySecret } from "@/lib/password";
import { getSmsSender } from "@/lib/sms";

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "no_code" | "expired" | "locked" | "mismatch"; message: string };

// Generate a fresh code, store it hashed, and send it via the active SMS sender.
export async function createAndSendOtp(
  phone: string,
  purpose = "registration",
): Promise<void> {
  // Invalidate any outstanding unconsumed codes for this phone+purpose.
  await db
    .delete(otpCodes)
    .where(
      and(
        eq(otpCodes.phone, phone),
        eq(otpCodes.purpose, purpose),
        isNull(otpCodes.consumedAt),
      ),
    );

  const code = String(randomInt(100000, 1000000));
  await db.insert(otpCodes).values({
    phone,
    purpose,
    codeHash: await hashSecret(code),
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
  });

  await getSmsSender().send(
    phone,
    `Your Techmykel verification code is ${code}. It expires in 10 minutes.`,
  );
}

export async function verifyOtp(
  phone: string,
  code: string,
  purpose = "registration",
): Promise<VerifyResult> {
  const [row] = await db
    .select()
    .from(otpCodes)
    .where(
      and(
        eq(otpCodes.phone, phone),
        eq(otpCodes.purpose, purpose),
        isNull(otpCodes.consumedAt),
      ),
    )
    .orderBy(desc(otpCodes.createdAt))
    .limit(1);

  if (!row) {
    return { ok: false, reason: "no_code", message: "No active code. Please request a new one." };
  }
  if (row.expiresAt.getTime() < Date.now()) {
    return { ok: false, reason: "expired", message: "Code expired. Please request a new one." };
  }
  if (row.attempts >= MAX_ATTEMPTS) {
    return { ok: false, reason: "locked", message: "Too many attempts. Please request a new code." };
  }

  await db
    .update(otpCodes)
    .set({ attempts: row.attempts + 1 })
    .where(eq(otpCodes.id, row.id));

  if (!(await verifySecret(code, row.codeHash))) {
    return { ok: false, reason: "mismatch", message: "Incorrect code. Please try again." };
  }

  await db
    .update(otpCodes)
    .set({ consumedAt: new Date() })
    .where(eq(otpCodes.id, row.id));

  return { ok: true };
}
