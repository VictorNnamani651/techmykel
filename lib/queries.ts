import "server-only";
import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { auditLog, redemptions, referrals, users } from "@/lib/db/schema";
import type { ReferralStatus, RedemptionStatus } from "@/lib/db/schema";

const ACTIVE_REDEMPTION = ["requested", "fulfilled"] as const;

// --- Referrer ---

export async function getReferrerOverview(userId: string) {
  const refs = await db
    .select()
    .from(referrals)
    .where(eq(referrals.referrerId, userId))
    .orderBy(desc(referrals.createdAt));

  const counts = { unverified: 0, pending: 0, successful: 0, failed: 0, rejected: 0 };
  for (const r of refs) counts[r.status] += 1;

  const refIds = refs.map((r) => r.id);
  const activeRows = refIds.length
    ? await db
        .select({ referralId: redemptions.referralId })
        .from(redemptions)
        .where(
          and(
            inArray(redemptions.referralId, refIds),
            inArray(redemptions.status, [...ACTIVE_REDEMPTION]),
          ),
        )
    : [];
  const activeSet = new Set(activeRows.map((a) => a.referralId));

  const ready = refs.filter((r) => r.status === "successful" && !activeSet.has(r.id));
  const readyTotal = ready.reduce((sum, r) => sum + (r.rewardAmount ?? 0), 0);

  return { counts, ready, readyTotal, total: refs.length };
}

export function listReferrals(userId: string, status?: ReferralStatus) {
  const where = status
    ? and(eq(referrals.referrerId, userId), eq(referrals.status, status))
    : eq(referrals.referrerId, userId);
  return db.select().from(referrals).where(where).orderBy(desc(referrals.createdAt));
}

export async function getReferralForReferrer(id: string, userId: string) {
  const [referral] = await db
    .select()
    .from(referrals)
    .where(and(eq(referrals.id, id), eq(referrals.referrerId, userId)))
    .limit(1);
  if (!referral) return null;

  const reds = await db
    .select()
    .from(redemptions)
    .where(eq(redemptions.referralId, id))
    .orderBy(desc(redemptions.requestedAt));

  const active =
    reds.find((r) => r.status === "requested" || r.status === "fulfilled") ?? null;

  return { referral, redemptions: reds, active };
}

export async function getTimeline(entityIds: string[]) {
  if (!entityIds.length) return [];
  return db
    .select()
    .from(auditLog)
    .where(inArray(auditLog.entityId, entityIds))
    .orderBy(desc(auditLog.createdAt));
}

export function listRedemptionsForReferrer(userId: string) {
  return db
    .select({
      id: redemptions.id,
      status: redemptions.status,
      rewardType: redemptions.rewardType,
      requestedAt: redemptions.requestedAt,
      resolvedAt: redemptions.resolvedAt,
      declineReason: redemptions.declineReason,
      referralId: redemptions.referralId,
      referredName: referrals.referredName,
      amount: referrals.rewardAmount,
    })
    .from(redemptions)
    .innerJoin(referrals, eq(redemptions.referralId, referrals.id))
    .where(eq(referrals.referrerId, userId))
    .orderBy(desc(redemptions.requestedAt));
}

// --- Admin ---

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export async function getAdminOverview() {
  const refs = await db
    .select({ status: referrals.status })
    .from(referrals);
  const counts = { unverified: 0, pending: 0, successful: 0, failed: 0, rejected: 0 };
  for (const r of refs) counts[r.status] += 1;

  const verifyQueue = await db
    .select({
      id: referrals.id,
      referredName: referrals.referredName,
      createdAt: referrals.createdAt,
      referrerName: users.fullName,
    })
    .from(referrals)
    .innerJoin(users, eq(referrals.referrerId, users.id))
    .where(eq(referrals.status, "unverified"))
    .orderBy(desc(referrals.createdAt))
    .limit(25);

  const fulfilQueue = await db
    .select({
      id: redemptions.id,
      rewardType: redemptions.rewardType,
      requestedAt: redemptions.requestedAt,
      referredName: referrals.referredName,
      amount: referrals.rewardAmount,
      referrerName: users.fullName,
    })
    .from(redemptions)
    .innerJoin(referrals, eq(redemptions.referralId, referrals.id))
    .innerJoin(users, eq(referrals.referrerId, users.id))
    .where(eq(redemptions.status, "requested"))
    .orderBy(desc(redemptions.requestedAt))
    .limit(25);

  const [openRow] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(redemptions)
    .where(eq(redemptions.status, "requested"));

  const fulfilled = await db
    .select({ amount: referrals.rewardAmount })
    .from(redemptions)
    .innerJoin(referrals, eq(redemptions.referralId, referrals.id))
    .where(eq(redemptions.status, "fulfilled"));
  const totalPaid = fulfilled.reduce((s, r) => s + (r.amount ?? 0), 0);

  return {
    counts,
    verifyQueue,
    fulfilQueue,
    openRedemptions: openRow?.c ?? 0,
    totalPaid,
  };
}

export async function listAllReferrals(opts: {
  search?: string;
  status?: ReferralStatus;
  page?: number;
  pageSize?: number;
}) {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = opts.pageSize ?? 20;

  const conds = [];
  if (opts.status) conds.push(eq(referrals.status, opts.status));
  if (opts.search?.trim()) {
    const s = opts.search.trim();
    const digits = s.replace(/\D/g, "");
    const ors = [ilike(referrals.referredName, `%${s}%`)];
    if (digits) ors.push(ilike(referrals.referredPhone, `%${digits}%`));
    conds.push(or(...ors));
  }
  const where = conds.length ? and(...conds) : undefined;

  const rows = await db
    .select({
      id: referrals.id,
      referredName: referrals.referredName,
      referredPhone: referrals.referredPhone,
      status: referrals.status,
      rewardAmount: referrals.rewardAmount,
      createdAt: referrals.createdAt,
      referrerName: users.fullName,
    })
    .from(referrals)
    .innerJoin(users, eq(referrals.referrerId, users.id))
    .where(where)
    .orderBy(desc(referrals.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const [countRow] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(referrals)
    .where(where);

  return { rows, total: countRow?.c ?? 0, page, pageSize };
}

export async function getReferralForAdmin(id: string) {
  const [referral] = await db
    .select({
      id: referrals.id,
      referredName: referrals.referredName,
      referredPhone: referrals.referredPhone,
      note: referrals.note,
      status: referrals.status,
      rewardAmount: referrals.rewardAmount,
      reason: referrals.reason,
      createdAt: referrals.createdAt,
      verifiedAt: referrals.verifiedAt,
      referrerId: referrals.referrerId,
      referrerName: users.fullName,
      referrerPhone: users.phone,
    })
    .from(referrals)
    .innerJoin(users, eq(referrals.referrerId, users.id))
    .where(eq(referrals.id, id))
    .limit(1);
  if (!referral) return null;

  const reds = await db
    .select()
    .from(redemptions)
    .where(eq(redemptions.referralId, id))
    .orderBy(desc(redemptions.requestedAt));

  return { referral, redemptions: reds };
}

export async function listAllRedemptions(opts: {
  status?: RedemptionStatus;
  page?: number;
  pageSize?: number;
}) {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = opts.pageSize ?? 20;
  const where = opts.status ? eq(redemptions.status, opts.status) : undefined;

  const rows = await db
    .select({
      id: redemptions.id,
      status: redemptions.status,
      rewardType: redemptions.rewardType,
      requestedAt: redemptions.requestedAt,
      resolvedAt: redemptions.resolvedAt,
      declineReason: redemptions.declineReason,
      referredName: referrals.referredName,
      amount: referrals.rewardAmount,
      referrerName: users.fullName,
      referrerPhone: users.phone,
    })
    .from(redemptions)
    .innerJoin(referrals, eq(redemptions.referralId, referrals.id))
    .innerJoin(users, eq(referrals.referrerId, users.id))
    .where(where)
    .orderBy(desc(redemptions.requestedAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const [countRow] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(redemptions)
    .where(where);

  return { rows, total: countRow?.c ?? 0, page, pageSize };
}

export async function listReferrers(
  opts: { search?: string; page?: number; pageSize?: number } = {},
) {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = opts.pageSize ?? 20;

  const conds = [eq(users.role, "referrer")];
  if (opts.search?.trim()) {
    const s = opts.search.trim();
    const digits = s.replace(/\D/g, "");
    const ors = [ilike(users.fullName, `%${s}%`)];
    if (digits) ors.push(ilike(users.phone, `%${digits}%`));
    conds.push(or(...ors)!);
  }
  const where = and(...conds);

  // Per-referrer counts aggregated in SQL (not in memory) so search + paging
  // stay cheap as the referrer base grows.
  const rows = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      phone: users.phone,
      createdAt: users.createdAt,
      convertedFromReferralId: users.convertedFromReferralId,
      total: sql<number>`count(${referrals.id})::int`,
      successful: sql<number>`(count(*) filter (where ${referrals.status} = 'successful'))::int`,
    })
    .from(users)
    .leftJoin(referrals, eq(referrals.referrerId, users.id))
    .where(where)
    .groupBy(users.id)
    .orderBy(desc(users.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const [countRow] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(users)
    .where(where);

  return {
    rows: rows.map((u) => ({
      id: u.id,
      fullName: u.fullName,
      phone: u.phone,
      createdAt: u.createdAt,
      converted: !!u.convertedFromReferralId,
      total: u.total,
      successful: u.successful,
    })),
    total: countRow?.c ?? 0,
    page,
    pageSize,
  };
}

export async function getReferrerForAdmin(id: string) {
  const [user] = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      phone: users.phone,
      createdAt: users.createdAt,
      convertedFromReferralId: users.convertedFromReferralId,
    })
    .from(users)
    .where(and(eq(users.id, id), eq(users.role, "referrer")))
    .limit(1);
  if (!user) return null;

  const refs = await db
    .select({
      id: referrals.id,
      referredName: referrals.referredName,
      referredPhone: referrals.referredPhone,
      status: referrals.status,
      rewardAmount: referrals.rewardAmount,
      createdAt: referrals.createdAt,
    })
    .from(referrals)
    .where(eq(referrals.referrerId, id))
    .orderBy(desc(referrals.createdAt));

  const reds = await db
    .select({
      id: redemptions.id,
      status: redemptions.status,
      rewardType: redemptions.rewardType,
      requestedAt: redemptions.requestedAt,
      resolvedAt: redemptions.resolvedAt,
      referredName: referrals.referredName,
      amount: referrals.rewardAmount,
    })
    .from(redemptions)
    .innerJoin(referrals, eq(redemptions.referralId, referrals.id))
    .where(eq(referrals.referrerId, id))
    .orderBy(desc(redemptions.requestedAt));

  // Reward earned = amount on successful referrals; paid out = amount on
  // fulfilled redemptions. Computed from the rows already fetched above.
  const successfulRefs = refs.filter((r) => r.status === "successful");
  const stats = {
    total: refs.length,
    successful: successfulRefs.length,
    earned: successfulRefs.reduce((sum, r) => sum + (r.rewardAmount ?? 0), 0),
    paidOut: reds
      .filter((r) => r.status === "fulfilled")
      .reduce((sum, r) => sum + (r.amount ?? 0), 0),
  };

  // Converted Referrer (ADR-0005): the referral whose referred_phone became
  // this account's phone. Surfaced so the admin can jump back to its origin.
  let convertedFrom: { id: string; referredName: string } | null = null;
  if (user.convertedFromReferralId) {
    const [orig] = await db
      .select({ id: referrals.id, referredName: referrals.referredName })
      .from(referrals)
      .where(eq(referrals.id, user.convertedFromReferralId))
      .limit(1);
    convertedFrom = orig ?? null;
  }

  return {
    referrer: {
      id: user.id,
      fullName: user.fullName,
      phone: user.phone,
      createdAt: user.createdAt,
      converted: !!user.convertedFromReferralId,
    },
    stats,
    convertedFrom,
    referrals: refs,
    redemptions: reds,
  };
}

export async function listAudit(opts: { page?: number; pageSize?: number }) {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = opts.pageSize ?? 30;

  const rows = await db
    .select({
      id: auditLog.id,
      action: auditLog.action,
      entityType: auditLog.entityType,
      entityId: auditLog.entityId,
      fromState: auditLog.fromState,
      toState: auditLog.toState,
      metadata: auditLog.metadata,
      createdAt: auditLog.createdAt,
      actorRole: auditLog.actorRole,
      actorName: users.fullName,
    })
    .from(auditLog)
    .leftJoin(users, eq(auditLog.actorUserId, users.id))
    .orderBy(desc(auditLog.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const [countRow] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(auditLog);

  return { rows, total: countRow?.c ?? 0, page, pageSize };
}

export async function getAnalytics() {
  const refs = await db
    .select({
      status: referrals.status,
      rewardAmount: referrals.rewardAmount,
      createdAt: referrals.createdAt,
    })
    .from(referrals);

  const byStatus = { unverified: 0, pending: 0, successful: 0, failed: 0, rejected: 0 };
  let rewardCost = 0;
  for (const r of refs) {
    byStatus[r.status] += 1;
    if (r.status === "successful") rewardCost += r.rewardAmount ?? 0;
  }
  const total = refs.length;
  const resolved = byStatus.successful + byStatus.failed;
  const conversionRate = resolved
    ? Math.round((byStatus.successful / resolved) * 1000) / 10
    : 0;

  const reds = await db
    .select({
      status: redemptions.status,
      rewardType: redemptions.rewardType,
      amount: referrals.rewardAmount,
    })
    .from(redemptions)
    .innerJoin(referrals, eq(redemptions.referralId, referrals.id));

  const byType = {
    cash: { count: 0, sum: 0 },
    airtime: { count: 0, sum: 0 },
    data: { count: 0, sum: 0 },
  };
  let totalPaid = 0;
  for (const r of reds) {
    if (r.status === "fulfilled") {
      byType[r.rewardType].count += 1;
      byType[r.rewardType].sum += r.amount ?? 0;
      totalPaid += r.amount ?? 0;
    }
  }

  const referrerRows = await db
    .select({ converted: users.convertedFromReferralId })
    .from(users)
    .where(eq(users.role, "referrer"));
  const totalReferrers = referrerRows.length;
  const convertedReferrers = referrerRows.filter((r) => r.converted).length;

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const overTime = days.map((d) => ({
    label: d.toLocaleDateString("en-GB", { weekday: "short" }),
    count: refs.filter((r) => sameDay(new Date(r.createdAt), d)).length,
  }));

  return {
    total,
    byStatus,
    conversionRate,
    rewardCost,
    totalPaid,
    byType,
    totalReferrers,
    convertedReferrers,
    overTime,
  };
}
