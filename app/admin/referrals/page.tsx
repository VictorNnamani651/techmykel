import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "All Referrals — RefReward" };

export default async function AdminReferralsPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const referrals = await prisma.referral.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      referrer: { select: { phoneNumber: true } },
      rewardConfig: { select: { title: true } },
      redemption: { select: { status: true } },
    },
  });

  const statusBadge: Record<string, string> = {
    PENDING: "badge badge-pending",
    SUCCESSFUL: "badge badge-successful",
    FAILED: "badge badge-failed",
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
          href="/admin"
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
          All Referrals 📋
        </h1>
        <p style={{ marginTop: "0.3rem", fontSize: "0.875rem", opacity: 0.75 }}>
          {referrals.length} total referral{referrals.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div style={{ padding: "0 1.25rem" }}>
        <Link
          href="/admin/referrals/new"
          className="btn-primary"
          style={{
            textDecoration: "none",
            marginBottom: "1.25rem",
            display: "flex",
          }}
        >
          ➕ Log New Referral
        </Link>

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
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {referrals.map((r) => (
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
                    gap: "0.75rem",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
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
                        margin: "0.2rem 0 0",
                      }}
                    >
                      Referrer: {r.referrer.phoneNumber}
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        margin: "0.1rem 0 0",
                      }}
                    >
                      {r.rewardConfig.title}
                      {r.redemption && (
                        <span
                          style={{
                            marginLeft: "0.4rem",
                            color:
                              r.redemption.status === "FULFILLED"
                                ? "#15803d"
                                : "var(--ocean)",
                            fontWeight: 600,
                          }}
                        >
                          ·{" "}
                          {r.redemption.status === "FULFILLED"
                            ? "Fulfilled ✓"
                            : "Redemption Requested"}
                        </span>
                      )}
                    </p>
                  </div>
                  <span className={statusBadge[r.status]}>
                    {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
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
