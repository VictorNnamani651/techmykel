import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { fulfillRedemption } from "@/app/actions";

export const metadata = { title: "Redemption Queue — RefReward" };

export default async function RedemptionsPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const requested = await prisma.redemption.findMany({
    where: { status: "REQUESTED" },
    orderBy: { createdAt: "asc" },
    include: {
      referral: {
        include: {
          referrer: { select: { phoneNumber: true } },
          rewardConfig: {
            select: { title: true, rewardType: true, value: true },
          },
        },
      },
    },
  });

  const fulfilled = await prisma.redemption.findMany({
    where: { status: "FULFILLED" },
    orderBy: { updatedAt: "desc" },
    take: 10,
    include: {
      referral: {
        include: {
          referrer: { select: { phoneNumber: true } },
          rewardConfig: { select: { title: true, rewardType: true } },
        },
      },
    },
  });

  const rewardTypeIcon: Record<string, string> = {
    CASH: "💵",
    AIRTIME: "📡",
    DATA: "📶",
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
          Redemption Queue ✅
        </h1>
        <p style={{ marginTop: "0.3rem", fontSize: "0.875rem", opacity: 0.75 }}>
          {requested.length} pending request{requested.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div style={{ padding: "0 1.25rem" }}>
        {/* Pending requests */}
        <p className="section-title">
          Awaiting Fulfillment
          {requested.length > 0 && (
            <span
              style={{
                marginLeft: "0.5rem",
                background: "var(--ocean)",
                color: "#fff",
                borderRadius: 99,
                padding: "0.1rem 0.55rem",
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              {requested.length}
            </span>
          )}
        </p>

        {requested.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "var(--text-muted)",
              marginBottom: "1.5rem",
            }}
          >
            <p style={{ fontSize: "2rem", margin: 0 }}>🎉</p>
            <p style={{ margin: "0.5rem 0 0" }}>
              All caught up! No pending redemptions.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.875rem",
              marginBottom: "1.5rem",
            }}
          >
            {requested.map((rd) => (
              <div
                key={rd.id}
                className="card"
                style={{ borderLeft: "4px solid var(--ocean)" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.875rem",
                    marginBottom: "0.875rem",
                  }}
                >
                  <span
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "var(--ice)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                      flexShrink: 0,
                    }}
                  >
                    {rewardTypeIcon[rd.referral.rewardConfig.rewardType]}
                  </span>
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
                      {rd.referral.customerName}
                    </p>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                        margin: "0.2rem 0 0",
                      }}
                    >
                      Referrer: {rd.referral.referrer.phoneNumber}
                    </p>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--ocean)",
                        fontWeight: 600,
                        margin: "0.1rem 0 0",
                      }}
                    >
                      {rd.referral.rewardConfig.title} ·{" "}
                      {rd.referral.rewardConfig.value.toLocaleString()}
                    </p>
                  </div>
                </div>
                <form action={fulfillRedemption.bind(null, rd.id)}>
                  <button type="submit" className="btn-primary">
                    ✅ Mark as Fulfilled
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}

        {/* Fulfilled history */}
        {fulfilled.length > 0 && (
          <>
            <p className="section-title">Recent Fulfillments</p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {fulfilled.map((rd) => (
                <div
                  key={rd.id}
                  className="card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.875rem",
                    opacity: 0.75,
                  }}
                >
                  <span style={{ fontSize: "1.25rem" }}>
                    {rewardTypeIcon[rd.referral.rewardConfig.rewardType]}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontWeight: 600,
                        margin: 0,
                        fontSize: "0.9rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {rd.referral.customerName}
                    </p>
                    <p
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--text-muted)",
                        margin: "0.15rem 0 0",
                      }}
                    >
                      {rd.referral.referrer.phoneNumber} ·{" "}
                      {rd.referral.rewardConfig.title}
                    </p>
                  </div>
                  <span className="badge badge-fulfilled">Fulfilled ✓</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
