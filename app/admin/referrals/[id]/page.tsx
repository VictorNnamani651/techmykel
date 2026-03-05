import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { updateReferralStatus, fulfillRedemption } from "@/app/actions";

export const metadata = { title: "Referral Detail — RefReward" };

export default async function ReferralDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const { id } = await params;

  const referral = await prisma.referral.findUnique({
    where: { id },
    include: {
      referrer: { select: { phoneNumber: true } },
      rewardConfig: true,
      redemption: true,
    },
  });

  if (!referral) notFound();

  const rewardTypeIcon: Record<string, string> = {
    CASH: "💵",
    AIRTIME: "📡",
    DATA: "📶",
  };

  const statusColor: Record<string, string> = {
    PENDING: "#d97706",
    SUCCESSFUL: "#16a34a",
    FAILED: "#dc2626",
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
          ← All Referrals
        </Link>
        <h1
          style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.5rem 0 0" }}
        >
          Referral Detail
        </h1>
        <p
          style={{
            marginTop: "0.3rem",
            fontSize: "0.8rem",
            opacity: 0.65,
            fontFamily: "monospace",
          }}
        >
          #{id.slice(0, 8).toUpperCase()}
        </p>
      </div>

      <div
        style={{
          padding: "0 1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {/* Info card */}
        <div className="card">
          <p className="section-title" style={{ marginBottom: "1rem" }}>
            Referral Info
          </p>
          <InfoRow label="Customer" value={referral.customerName} />
          {referral.customerPhone && (
            <InfoRow label="Customer Phone" value={referral.customerPhone} />
          )}
          <InfoRow label="Referred By" value={referral.referrer.phoneNumber} />
          <InfoRow
            label="Status"
            value={referral.status}
            valueColor={statusColor[referral.status]}
            bold
          />
          <InfoRow
            label="Created"
            value={new Date(referral.createdAt).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />
        </div>

        {/* Reward config card */}
        <div className="card">
          <p className="section-title" style={{ marginBottom: "1rem" }}>
            Reward Config
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "var(--ice)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                flexShrink: 0,
              }}
            >
              {rewardTypeIcon[referral.rewardConfig.rewardType]}
            </span>
            <div>
              <p
                style={{
                  fontWeight: 700,
                  margin: 0,
                  color: "var(--text-primary)",
                }}
              >
                {referral.rewardConfig.title}
              </p>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  margin: "0.2rem 0 0",
                }}
              >
                {referral.rewardConfig.rewardType} ·{" "}
                {referral.rewardConfig.value.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Redemption status */}
        {referral.redemption && (
          <div className="card">
            <p className="section-title" style={{ marginBottom: "1rem" }}>
              Redemption
            </p>
            <InfoRow
              label="Status"
              value={referral.redemption.status}
              valueColor={
                referral.redemption.status === "FULFILLED"
                  ? "#16a34a"
                  : "var(--ocean)"
              }
              bold
            />
            {referral.redemption.status === "REQUESTED" && (
              <form
                action={fulfillRedemption.bind(null, referral.redemption.id)}
                style={{ marginTop: "1rem" }}
              >
                <button type="submit" className="btn-primary">
                  ✅ Mark as Fulfilled
                </button>
              </form>
            )}
            {referral.redemption.status === "FULFILLED" && (
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#15803d",
                  fontWeight: 600,
                  marginTop: "0.75rem",
                }}
              >
                🎉 Reward has been disbursed.
              </p>
            )}
          </div>
        )}

        {/* Status update actions — only for PENDING referrals */}
        {referral.status === "PENDING" && (
          <div className="card">
            <p className="section-title" style={{ marginBottom: "1rem" }}>
              Update Status
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <form
                action={updateReferralStatus.bind(null, id, "SUCCESSFUL")}
                style={{ flex: 1 }}
              >
                <button type="submit" className="btn-primary">
                  ✅ Mark Successful
                </button>
              </form>
              <form
                action={updateReferralStatus.bind(null, id, "FAILED")}
                style={{ flex: 1 }}
              >
                <button type="submit" className="btn-danger">
                  ❌ Mark Failed
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Already resolved notice */}
        {referral.status !== "PENDING" && !referral.redemption && (
          <div
            style={{
              padding: "1rem",
              borderRadius: "var(--radius-sm)",
              background:
                referral.status === "SUCCESSFUL" ? "#dcfce7" : "#fee2e2",
              color: referral.status === "SUCCESSFUL" ? "#15803d" : "#991b1b",
              fontWeight: 500,
              fontSize: "0.875rem",
            }}
          >
            {referral.status === "SUCCESSFUL"
              ? "✅ This referral is successful. Awaiting referrer to request redemption."
              : "❌ This referral was marked as failed."}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  valueColor,
  bold,
}: {
  label: string;
  value: string;
  valueColor?: string;
  bold?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.625rem 0",
        borderBottom: "1px solid var(--ice)",
      }}
    >
      <span
        style={{
          fontSize: "0.8375rem",
          color: "var(--text-muted)",
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "0.8375rem",
          fontWeight: bold ? 700 : 600,
          color: valueColor ?? "var(--text-primary)",
        }}
      >
        {value}
      </span>
    </div>
  );
}
