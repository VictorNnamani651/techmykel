import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { requestRedemption } from "@/app/actions";

export const metadata = { title: "My Referrals — RefReward" };

export default async function ReferrerReferralsPage() {
  const session = await auth();
  if (!session || session.user.role !== "REFERRER") redirect("/login");

  const referrals = await prisma.referral.findMany({
    where: { referrerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      rewardConfig: { select: { title: true, rewardType: true, value: true } },
      redemption: { select: { id: true, status: true } },
    },
  });

  const rewardTypeIcon: Record<string, string> = {
    CASH: "💵",
    AIRTIME: "📡",
    DATA: "📶",
  };

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

  return (
    <div style={{ padding: "0 0 1rem" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--navy), var(--ocean))",
          padding: "3rem 1.5rem 2rem",
          color: "#fff",
          borderRadius: "0 0 32px 32px",
          marginBottom: "1.5rem",
        }}
      >
        <Link
          href="/dashboard"
          style={{
            color: "rgba(255,255,255,0.7)",
            textDecoration: "none",
            fontSize: "0.875rem",
          }}
        >
          ← Home
        </Link>
        <h1
          style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.5rem 0 0" }}
        >
          My Referrals 📋
        </h1>
        <p style={{ marginTop: "0.3rem", fontSize: "0.875rem", opacity: 0.75 }}>
          {referrals.length} referral{referrals.length !== 1 ? "s" : ""} total
        </p>
      </div>

      <div style={{ padding: "0 1.25rem" }}>
        {referrals.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "2.5rem",
              color: "var(--text-muted)",
            }}
          >
            <p style={{ fontSize: "2rem", margin: 0 }}>📭</p>
            <p style={{ marginTop: "0.5rem" }}>No referrals yet.</p>
            <p style={{ fontSize: "0.8125rem", marginTop: "0.25rem" }}>
              Contact your admin to get started.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.875rem",
            }}
          >
            {referrals.map((r) => {
              const canRedeem = r.status === "SUCCESSFUL" && !r.redemption;
              const redeemed = !!r.redemption;

              return (
                <div
                  key={r.id}
                  className="card"
                  style={{
                    borderLeft: canRedeem
                      ? "4px solid var(--sky)"
                      : "4px solid transparent",
                  }}
                >
                  {/* Top row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "0.75rem",
                      marginBottom: "0.875rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.875rem",
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <span
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: "var(--ice)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.1rem",
                          flexShrink: 0,
                        }}
                      >
                        {rewardTypeIcon[r.rewardConfig.rewardType]}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            fontWeight: 700,
                            margin: 0,
                            fontSize: "0.9375rem",
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
                            margin: "0.15rem 0 0",
                          }}
                        >
                          {r.rewardConfig.title} ·{" "}
                          {r.rewardConfig.value.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className={statusBadge[r.status]}>
                      {statusLabel[r.status]}
                    </span>
                  </div>

                  {/* Redemption status */}
                  {redeemed && (
                    <div
                      style={{
                        padding: "0.5rem 0.875rem",
                        borderRadius: "var(--radius-sm)",
                        background:
                          r.redemption!.status === "FULFILLED"
                            ? "#dcfce7"
                            : "var(--ice)",
                        color:
                          r.redemption!.status === "FULFILLED"
                            ? "#15803d"
                            : "var(--ocean)",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      {r.redemption!.status === "FULFILLED"
                        ? "🎉 Reward disbursed!"
                        : "⏳ Redemption requested — admin will fulfill soon"}
                    </div>
                  )}

                  {/* Redeem CTA */}
                  {canRedeem && (
                    <form
                      action={requestRedemption.bind(null, r.id)}
                      style={{ marginTop: "0.75rem" }}
                    >
                      <button type="submit" className="btn-primary">
                        🎁 Request Reward
                      </button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
