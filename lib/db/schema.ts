import { sql } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// --- Enums (domain language; see CONTEXT.md) ---

export const userRole = pgEnum("user_role", ["admin", "referrer"]);

export const referralStatus = pgEnum("referral_status", [
  "unverified",
  "pending",
  "successful",
  "failed",
  "rejected",
]);

export const rewardType = pgEnum("reward_type", ["cash", "airtime", "data"]);

export const redemptionStatus = pgEnum("redemption_status", [
  "requested",
  "fulfilled",
  "declined",
  "cancelled",
]);

export const auditEntityType = pgEnum("audit_entity_type", [
  "referral",
  "redemption",
]);

// --- Tables ---

// Referrers and the single admin. Phone is the login identity (unique among users).
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  role: userRole("role").notNull().default("referrer"),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull().unique(), // E.164, normalized
  passwordHash: text("password_hash").notNull(),
  phoneVerifiedAt: timestamp("phone_verified_at", { withTimezone: true }),
  // Converted Referrer flag (ADR-0005): set when this account's phone matches a
  // prior referred_phone. Logical reference to referrals.id (no hard FK to avoid
  // a circular constraint with referrals.referrer_id).
  convertedFromReferralId: uuid("converted_from_referral_id"),
  // Reward Destination defaults (ADR-0011). Reusable so a referrer types their
  // bank details once; each redemption still snapshots what it actually used.
  // destinationPhone is NOT saved back here after a redemption - sending airtime
  // to someone else's number is a one-off and must not become the default.
  destinationBankName: text("destination_bank_name"),
  destinationAccountNumber: text("destination_account_number"),
  destinationAccountName: text("destination_account_name"),
  destinationPhone: text("destination_phone"), // E.164
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// A Referrer's claim that they sent a specific Referred Customer.
// referred_phone is globally unique => "referred once, ever" (ADR-0004/0005).
export const referrals = pgTable("referrals", {
  id: uuid("id").primaryKey().defaultRandom(),
  referrerId: uuid("referrer_id")
    .notNull()
    .references(() => users.id),
  referredName: text("referred_name").notNull(),
  referredPhone: text("referred_phone").notNull().unique(), // E.164, normalized
  note: text("note"),
  status: referralStatus("status").notNull().default("unverified"),
  // Whole-naira reward set by admin at verification; null until then (ADR-0002).
  rewardAmount: integer("reward_amount"),
  reason: text("reason"), // context for failed / rejected
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
});

// A request to receive the reward for a Successful referral.
// At most one ACTIVE (requested|fulfilled) per referral — enforced by the
// partial unique index below — but re-redeemable after cancel/decline.
export const redemptions = pgTable(
  "redemptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    referralId: uuid("referral_id")
      .notNull()
      .references(() => referrals.id),
    rewardType: rewardType("reward_type").notNull(),
    status: redemptionStatus("status").notNull().default("requested"),
    declineReason: text("decline_reason"),
    // Reward Destination snapshot (ADR-0011): where THIS reward was sent, frozen
    // at request time. Deliberately duplicates the users columns - do not
    // normalise this away, it is the only record of where money actually went.
    // Cash fills the three bank columns; airtime/data fills the phone.
    destinationBankName: text("destination_bank_name"),
    destinationAccountNumber: text("destination_account_number"),
    destinationAccountName: text("destination_account_name"),
    destinationPhone: text("destination_phone"), // E.164
    requestedAt: timestamp("requested_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("redemptions_one_active_per_referral")
      .on(table.referralId)
      .where(sql`${table.status} in ('requested', 'fulfilled')`),
  ],
);

// System-wide, append-only, immutable record (ADR-0003). Never updated/deleted.
export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorUserId: uuid("actor_user_id").references(() => users.id),
  actorRole: text("actor_role"),
  action: text("action").notNull(),
  entityType: auditEntityType("entity_type").notNull(),
  entityId: uuid("entity_id").notNull(),
  fromState: text("from_state"),
  toState: text("to_state"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// In-app notifications (V1: in-app only).
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  type: text("type").notNull(),
  entityType: text("entity_type"),
  entityId: uuid("entity_id"),
  message: text("message").notNull(),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// DB-backed sessions (ADR-0006). Cookie carries a jose-signed {sid, role}.
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  role: userRole("role").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// One-time codes for registration phone-ownership verification.
export const otpCodes = pgTable("otp_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  phone: text("phone").notNull(),
  codeHash: text("code_hash").notNull(),
  purpose: text("purpose").notNull().default("registration"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  consumedAt: timestamp("consumed_at", { withTimezone: true }),
  attempts: integer("attempts").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// --- Inferred types ---

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Referral = typeof referrals.$inferSelect;
export type NewReferral = typeof referrals.$inferInsert;
export type Redemption = typeof redemptions.$inferSelect;
export type NewRedemption = typeof redemptions.$inferInsert;
export type AuditEntry = typeof auditLog.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Session = typeof sessions.$inferSelect;

export type UserRole = (typeof userRole.enumValues)[number];
export type ReferralStatus = (typeof referralStatus.enumValues)[number];
export type RewardType = (typeof rewardType.enumValues)[number];
export type RedemptionStatus = (typeof redemptionStatus.enumValues)[number];
