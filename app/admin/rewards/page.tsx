import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createRewardConfig, toggleRewardConfig } from "@/app/actions";

export const metadata = { title: "Reward Settings — RefReward" };

export default async function RewardsPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const rewards = await prisma.rewardConfig.findMany({
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
          href="/admin"
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
          Reward Settings 🎁
        </h1>
        <p style={{ marginTop: "0.3rem", fontSize: "0.875rem", opacity: 0.75 }}>
          Add reward tiers — new entries only, never edit old ones.
        </p>
      </div>

      <div style={{ padding: "0 1.25rem" }}>
        {/* Create form */}
        <p className="section-title">Add New Reward</p>
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <form
            action={createRewardConfig}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label style={labelStyle}>Reward Label</label>
              <input
                name="title"
                className="input"
                placeholder="e.g. ₦1,000 Cash"
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Reward Type</label>
              <select
                name="rewardType"
                className="input"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select type…
                </option>
                <option value="CASH">💵 Cash</option>
                <option value="AIRTIME">📡 Airtime</option>
                <option value="DATA">📶 Data</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Value (₦ or MB)</label>
              <input
                name="value"
                type="number"
                min="1"
                className="input"
                placeholder="e.g. 1000"
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              + Add Reward Config
            </button>
          </form>
        </div>

        {/* Existing rewards */}
        <p className="section-title">Existing Configs</p>
        {rewards.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "var(--text-muted)",
            }}
          >
            <p style={{ fontSize: "2rem", margin: 0 }}>🎁</p>
            <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
              No reward configs yet.
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {rewards.map((r: any) => (
              <div
                key={r.id}
                className="card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  opacity: r.isActive ? 1 : 0.55,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.875rem",
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
                      fontSize: "1.3rem",
                      flexShrink: 0,
                    }}
                  >
                    {rewardTypeIcon[r.rewardType]}
                  </span>
                  <div>
                    <p
                      style={{
                        fontWeight: 700,
                        margin: 0,
                        fontSize: "0.9375rem",
                        color: "var(--text-primary)",
                      }}
                    >
                      {r.title}
                    </p>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                        margin: "0.15rem 0 0",
                      }}
                    >
                      {r.rewardType} · {r.value.toLocaleString()}
                    </p>
                  </div>
                </div>
                <form action={toggleRewardConfig.bind(null, r.id, !r.isActive)}>
                  <button
                    type="submit"
                    style={{
                      padding: "0.4rem 0.85rem",
                      borderRadius: 99,
                      border: "1.5px solid",
                      borderColor: r.isActive ? "#16a34a" : "var(--text-muted)",
                      background: r.isActive ? "#dcfce7" : "#f1f5f9",
                      color: r.isActive ? "#15803d" : "var(--text-muted)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {r.isActive ? "Active" : "Inactive"}
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
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
