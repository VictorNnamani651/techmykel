import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Admin Dashboard — RefReward" };

async function getAdminStats() {
  const [
    totalReferrers,
    totalReferrals,
    pendingReferrals,
    successfulReferrals,
    failedReferrals,
    pendingRedemptions,
    recentReferrals,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "REFERRER" } }),
    prisma.referral.count(),
    prisma.referral.count({ where: { status: "PENDING" } }),
    prisma.referral.count({ where: { status: "SUCCESSFUL" } }),
    prisma.referral.count({ where: { status: "FAILED" } }),
    prisma.redemption.count({ where: { status: "REQUESTED" } }),
    prisma.referral.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        referrer: { select: { phoneNumber: true } },
        rewardConfig: { select: { title: true } },
      },
    }),
  ]);

  return {
    totalReferrers,
    totalReferrals,
    pendingReferrals,
    successfulReferrals,
    failedReferrals,
    pendingRedemptions,
    recentReferrals,
  };
}

const statusBadge: Record<string, string> = {
  PENDING: "badge badge-pending",
  SUCCESSFUL: "badge badge-successful",
  FAILED: "badge badge-failed",
};

const statusLabel: Record<string, string> = {
  PENDING: "Pending",
  SUCCESSFUL: "Successful",
  FAILED: "Failed",
};

export default async function AdminDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const stats = await getAdminStats();

  return (
    <div style={{ padding: "0 0 1rem" }}>
      {/* ── Top header ── */}
      <div
        style={{
          background:
            "linear-gradient(135deg, var(--navy) 0%, var(--ocean) 100%)",
          padding: "3rem 1.5rem 2rem",
          color: "#fff",
          borderRadius: "0 0 32px 32px",
          marginBottom: "1.5rem",
        }}
      >
        <p
          style={{
            fontSize: "0.8125rem",
            opacity: 0.75,
            marginBottom: "0.25rem",
            fontWeight: 500,
          }}
        >
          Welcome back, Admin 👋
        </p>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
          Overview
        </h1>
        <p
          style={{ marginTop: "0.375rem", fontSize: "0.875rem", opacity: 0.7 }}
        >
          Here&apos;s what&apos;s happening today
        </p>
      </div>

      <div style={{ padding: "0 1.25rem" }}>
        {/* ── Stat cards ── */}
        <p className="section-title">Platform Stats</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.875rem",
            marginBottom: "1.5rem",
          }}
        >
          <StatCard
            emoji="👥"
            label="Referrers"
            value={stats.totalReferrers}
            color="var(--navy)"
          />
          <StatCard
            emoji="📋"
            label="Total Referrals"
            value={stats.totalReferrals}
            color="var(--ocean)"
          />
          <StatCard
            emoji="⏳"
            label="Pending"
            value={stats.pendingReferrals}
            color="#d97706"
          />
          <StatCard
            emoji="✅"
            label="Successful"
            value={stats.successfulReferrals}
            color="#16a34a"
          />
          <StatCard
            emoji="❌"
            label="Failed"
            value={stats.failedReferrals}
            color="#dc2626"
          />
          <StatCard
            emoji="🎁"
            label="Redeem Queue"
            value={stats.pendingRedemptions}
            color="var(--sky)"
            urgent={stats.pendingRedemptions > 0}
          />
        </div>

        {/* ── Quick actions ── */}
        <p className="section-title">Quick Actions</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          <ActionButton
            href="/admin/referrals/new"
            emoji="➕"
            label="New Referral"
            primary
          />
          <ActionButton
            href="/admin/rewards"
            emoji="🎁"
            label="Manage Rewards"
          />
          <ActionButton
            href="/admin/referrals"
            emoji="📋"
            label="All Referrals"
          />
          <ActionButton
            href="/admin/redemptions"
            emoji="✅"
            label="Redemptions"
          />
        </div>

        {/* ── Recent referrals ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.75rem",
          }}
        >
          <p className="section-title" style={{ marginBottom: 0 }}>
            Recent Referrals
          </p>
          <Link
            href="/admin/referrals"
            style={{
              fontSize: "0.8125rem",
              color: "var(--ocean)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            View all →
          </Link>
        </div>

        {stats.recentReferrals.length === 0 ? (
          <EmptyState message="No referrals yet. Create your first one!" />
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {stats.recentReferrals.map((r) => (
              <Link
                key={r.id}
                href={`/admin/referrals/${r.id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "box-shadow 0.2s ease",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: "0.9375rem",
                        color: "var(--text-primary)",
                        margin: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {r.customerName}
                    </p>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                        margin: "0.2rem 0 0",
                      }}
                    >
                      by {r.referrer.phoneNumber} · {r.rewardConfig.title}
                    </p>
                  </div>
                  <span className={statusBadge[r.status]}>
                    {statusLabel[r.status]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function StatCard({
  emoji,
  label,
  value,
  color,
  urgent,
}: {
  emoji: string;
  label: string;
  value: number;
  color: string;
  urgent?: boolean;
}) {
  return (
    <div
      className="card"
      style={{
        position: "relative",
        overflow: "hidden",
        outline: urgent ? `2px solid ${color}` : "none",
      }}
    >
      {urgent && (
        <span
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: color,
          }}
        />
      )}
      <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{emoji}</div>
      <div
        style={{ fontSize: "1.75rem", fontWeight: 800, color, lineHeight: 1 }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          marginTop: "0.3rem",
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function ActionButton({
  href,
  emoji,
  label,
  primary,
}: {
  href: string;
  emoji: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: primary
            ? "linear-gradient(135deg, var(--ocean), var(--sky))"
            : "var(--surface)",
          border: primary ? "none" : "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.4rem",
          boxShadow: primary ? "var(--shadow-md)" : "var(--shadow-sm)",
          transition: "transform 0.15s ease",
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>{emoji}</span>
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            color: primary ? "#fff" : "var(--text-primary)",
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          {label}
        </span>
      </div>
    </Link>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="card"
      style={{
        textAlign: "center",
        padding: "2rem",
        color: "var(--text-muted)",
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📭</div>
      <p style={{ fontSize: "0.9rem", margin: 0 }}>{message}</p>
    </div>
  );
}
