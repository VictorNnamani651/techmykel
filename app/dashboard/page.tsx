import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "My Dashboard — RefReward" };

async function getReferrerStats(userId: string) {
  const [
    total,
    pending,
    successful,
    failed,
    pendingRedemptions,
    recentReferrals,
  ] = await Promise.all([
    prisma.referral.count({ where: { referrerId: userId } }),
    prisma.referral.count({ where: { referrerId: userId, status: "PENDING" } }),
    prisma.referral.count({
      where: { referrerId: userId, status: "SUCCESSFUL" },
    }),
    prisma.referral.count({ where: { referrerId: userId, status: "FAILED" } }),
    prisma.redemption.count({
      where: {
        referral: { referrerId: userId },
        status: "REQUESTED",
      },
    }),
    prisma.referral.findMany({
      where: { referrerId: userId },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: {
        rewardConfig: { select: { title: true } },
        redemption: { select: { status: true } },
      },
    }),
  ]);

  return {
    total,
    pending,
    successful,
    failed,
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

export default async function ReferrerDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "REFERRER") redirect("/login");

  const stats = await getReferrerStats(session.user.id);
  const phone = session.user.phoneNumber;
  const initials = phone.slice(-4);

  return (
    <div style={{ padding: "0 0 1rem" }}>
      {/* ── Header ── */}
      <div
        style={{
          background:
            "linear-gradient(135deg, var(--navy) 0%, var(--ocean) 100%)",
          padding: "3rem 1.5rem 2.5rem",
          color: "#fff",
          borderRadius: "0 0 32px 32px",
          marginBottom: "1.5rem",
          position: "relative",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            position: "absolute",
            top: "2.5rem",
            right: "1.5rem",
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            border: "2px solid rgba(255,255,255,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "0.875rem",
          }}
        >
          ···{initials}
        </div>

        <p
          style={{
            fontSize: "0.8125rem",
            opacity: 0.75,
            marginBottom: "0.25rem",
            fontWeight: 500,
          }}
        >
          Welcome back 👋
        </p>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
          My Dashboard
        </h1>
        <p
          style={{ marginTop: "0.375rem", fontSize: "0.875rem", opacity: 0.7 }}
        >
          {phone}
        </p>

        {/* Summary pill */}
        <div
          style={{
            marginTop: "1.25rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(6px)",
            borderRadius: 99,
            padding: "0.4rem 1rem",
            fontSize: "0.875rem",
            fontWeight: 600,
          }}
        >
          <span>✅</span>
          <span>
            {stats.successful} Successful Referral
            {stats.successful !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div style={{ padding: "0 1.25rem" }}>
        {/* ── Stat cards ── */}
        <p className="section-title">Your Stats</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.875rem",
            marginBottom: "1.5rem",
          }}
        >
          <StatCard
            emoji="📋"
            label="Total Referrals"
            value={stats.total}
            color="var(--ocean)"
          />
          <StatCard
            emoji="✅"
            label="Successful"
            value={stats.successful}
            color="#16a34a"
          />
          <StatCard
            emoji="⏳"
            label="Pending"
            value={stats.pending}
            color="#d97706"
          />
          <StatCard
            emoji="🎁"
            label="Awaiting Reward"
            value={stats.pendingRedemptions}
            color="var(--sky)"
          />
        </div>

        {/* ── CTA — redeem available rewards ── */}
        {stats.successful > 0 && (
          <Link href="/dashboard/referrals" style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "linear-gradient(135deg, var(--ocean), var(--sky))",
                borderRadius: "var(--radius-lg)",
                padding: "1.25rem 1.5rem",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#fff",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div>
                <p style={{ fontWeight: 700, fontSize: "1rem", margin: 0 }}>
                  Claim Your Reward 🎉
                </p>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    opacity: 0.85,
                    margin: "0.25rem 0 0",
                  }}
                >
                  You have successful referrals. Tap to redeem.
                </p>
              </div>
              <span style={{ fontSize: "1.75rem", marginLeft: "1rem" }}>→</span>
            </div>
          </Link>
        )}

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
            href="/dashboard/referrals"
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
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "var(--text-muted)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📭</div>
            <p style={{ fontSize: "0.9rem", margin: 0 }}>
              You haven&apos;t made any referrals yet.
            </p>
            <p
              style={{
                fontSize: "0.8125rem",
                color: "var(--text-muted)",
                marginTop: "0.25rem",
              }}
            >
              Contact your admin to get started.
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {stats.recentReferrals.map((r) => (
              <Link
                key={r.id}
                href={`/dashboard/referrals`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
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
                      {r.rewardConfig.title}
                      {r.redemption && (
                        <span
                          style={{
                            marginLeft: "0.5rem",
                            fontSize: "0.7rem",
                            color:
                              r.redemption.status === "FULFILLED"
                                ? "#15803d"
                                : "var(--ocean)",
                            fontWeight: 600,
                          }}
                        >
                          ·{" "}
                          {r.redemption.status === "FULFILLED"
                            ? "Reward sent ✓"
                            : "Redemption pending"}
                        </span>
                      )}
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

/* ── Stat card ── */
function StatCard({
  emoji,
  label,
  value,
  color,
}: {
  emoji: string;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="card">
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
