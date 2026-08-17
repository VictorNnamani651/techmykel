import { z } from "zod";
import { isValidNgPhone, normalizeNgPhone } from "@/lib/phone";
import { NIGERIAN_BANKS } from "@/lib/banks";

// Validates an NG phone and normalizes the output to E.164 "+234…".
export const phoneField = z
  .string()
  .trim()
  .refine(isValidNgPhone, { message: "Enter a valid Nigerian phone number." })
  .transform((v) => normalizeNgPhone(v) as string);

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, { message: "Name must be at least 2 characters." }),
  phone: phoneField,
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const loginSchema = z.object({
  phone: phoneField,
  password: z.string().min(1, { message: "Password is required." }),
});

export const otpSchema = z.object({
  phone: phoneField,
  code: z.string().trim().regex(/^\d{6}$/, { message: "Enter the 6-digit code." }),
});

export const referralSchema = z.object({
  referredName: z.string().trim().min(2, { message: "Customer name is required." }),
  referredPhone: phoneField,
  note: z.string().trim().max(500).optional().or(z.literal("")),
});

export const verifyReferralSchema = z.object({
  rewardAmount: z.coerce
    .number()
    .int({ message: "Amount must be a whole number of naira." })
    .positive({ message: "Enter a reward amount greater than 0." }),
});

// Which Reward Destination fields are required depends on the Reward Type, so
// this is a discriminated union rather than a DB CHECK (ADR-0011) - the errors
// need to land on individual form fields.
const bankField = z.enum(NIGERIAN_BANKS, {
  message: "Choose your bank from the list.",
});

// NUBAN account numbers are exactly 10 digits.
const accountNumberField = z
  .string()
  .trim()
  .regex(/^\d{10}$/, { message: "Account number must be exactly 10 digits." });

const accountNameField = z
  .string()
  .trim()
  .min(2, { message: "Enter the account name exactly as your bank has it." });

export const redeemSchema = z.discriminatedUnion("rewardType", [
  z.object({
    rewardType: z.literal("cash"),
    destinationBankName: bankField,
    destinationAccountNumber: accountNumberField,
    destinationAccountName: accountNameField,
  }),
  z.object({
    rewardType: z.literal("airtime"),
    destinationPhone: phoneField,
  }),
  z.object({
    rewardType: z.literal("data"),
    destinationPhone: phoneField,
  }),
]);
