import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createReferral } from "@/app/actions";

export const metadata = { title: "New Referral — RefReward" };

export default async function NewReferralPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const activeRewards = await prisma.rewardConfig.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
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
          href="/admin/referrals"
          style={{
            color: "rgba(255,255,255,0.7)",
            textDecoration: "none",
            fontSize: "0.875rem",
          }}
        >
          ← Back
        </Link>
        <h1
          style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.5rem 0 0" }}
        >
          Log New Referral ➕
        </h1>
        <p style={{ marginTop: "0.3rem", fontSize: "0.875rem", opacity: 0.75 }}>
          Record a customer visit and link it to a referrer.
        </p>
      </div>

      <div style={{ padding: "0 1.25rem" }}>
        <div className="card">
          <form
            action={createReferral}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.125rem",
            }}
          >
            {/* Referrer phone */}
            <div>
              <label style={labelStyle}>Referrer&apos;s Phone Number *</label>
              <div style={{ position: "relative" }}>
                <span style={iconStyle}>📱</span>
                <input
                  name="referrerPhone"
                  type="tel"
                  inputMode="numeric"
                  className="input"
                  placeholder="e.g. 08012345678"
                  style={{ paddingLeft: "3rem" }}
                  required
                />
              </div>
              <p style={hintStyle}>
                Enter the phone number of the registered referrer.
              </p>
            </div>

            {/* Customer name */}
            <div>
              <label style={labelStyle}>Customer Name *</label>
              <div style={{ position: "relative" }}>
                <span style={iconStyle}>👤</span>
                <input
                  name="customerName"
                  type="text"
                  className="input"
                  placeholder="e.g. Amina Yusuf"
                  style={{ paddingLeft: "3rem" }}
                  required
                />
              </div>
            </div>

            {/* Customer phone (optional) */}
            <div>
              <label style={labelStyle}>
                Customer Phone{" "}
                <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
                  (optional)
                </span>
              </label>
              <div style={{ position: "relative" }}>
                <span style={iconStyle}>📞</span>
                <input
                  name="customerPhone"
                  type="tel"
                  inputMode="numeric"
                  className="input"
                  placeholder="e.g. 07011223344"
                  style={{ paddingLeft: "3rem" }}
                />
              </div>
            </div>

            {/* Reward config */}
            <div>
              <label style={labelStyle}>Reward Config *</label>
              {activeRewards.length === 0 ? (
                <div
                  style={{
                    padding: "1rem",
                    background: "#fef3c7",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.875rem",
                    color: "#92400e",
                    fontWeight: 500,
                  }}
                >
                  ⚠️ No active reward configs.{" "}
                  <Link
                    href="/admin/rewards"
                    style={{ color: "#0077b6", fontWeight: 700 }}
                  >
                    Add one first
                  </Link>
                  .
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {activeRewards.map((rw) => (
                    <label
                      key={rw.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.875rem",
                        padding: "0.875rem",
                        borderRadius: "var(--radius-sm)",
                        border: "1.5px solid var(--light-blue)",
                        background: "var(--ice)",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="rewardConfigId"
                        value={rw.id}
                        required
                        style={{
                          accentColor: "var(--ocean)",
                          width: 18,
                          height: 18,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: "1.2rem" }}>
                        {rewardTypeIcon[rw.rewardType]}
                      </span>
                      <div>
                        <p
                          style={{
                            fontWeight: 700,
                            margin: 0,
                            fontSize: "0.9rem",
                            color: "var(--text-primary)",
                          }}
                        >
                          {rw.title}
                        </p>
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                            margin: 0,
                          }}
                        >
                          {rw.rewardType} · {rw.value.toLocaleString()}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={activeRewards.length === 0}
              style={{ marginTop: "0.5rem" }}
            >
              Create Referral →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "var(--text-secondary)",
  marginBottom: "0.45rem",
};

const iconStyle: React.CSSProperties = {
  position: "absolute",
  left: "1rem",
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "1.1rem",
  pointerEvents: "none",
  color: "var(--sky)",
};

const hintStyle: React.CSSProperties = {
  fontSize: "0.78rem",
  color: "var(--text-muted)",
  marginTop: "0.35rem",
};
