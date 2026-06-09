import type { AuditEntry } from "@/lib/db/schema";
import { cn, naira } from "@/components/ui";
import { formatShortDate } from "@/lib/format";

const META: Record<string, { label: string; color: string }> = {
  "referral.created": { label: "Submitted", color: "bg-slate-300" },
  "referral.verified": { label: "Verified", color: "bg-info" },
  "referral.amount_edited": { label: "Reward updated", color: "bg-info" },
  "referral.successful": { label: "Successful", color: "bg-success" },
  "referral.failed": { label: "Failed", color: "bg-slate-400" },
  "referral.rejected": { label: "Rejected", color: "bg-danger" },
  "redemption.requested": { label: "Redemption requested", color: "bg-info" },
  "redemption.fulfilled": { label: "Redemption fulfilled", color: "bg-success" },
  "redemption.declined": { label: "Redemption declined", color: "bg-danger" },
  "redemption.cancelled": { label: "Redemption cancelled", color: "bg-slate-400" },
};

function subtitle(e: AuditEntry): string {
  const meta = (e.metadata ?? {}) as Record<string, unknown>;
  const date = formatShortDate(e.createdAt);
  if (
    (e.action === "referral.verified" || e.action === "referral.amount_edited") &&
    meta.amount != null
  )
    return `Reward ${naira(Number(meta.amount))} · ${date}`;
  if (
    (e.action === "referral.failed" ||
      e.action === "referral.rejected" ||
      e.action === "redemption.declined") &&
    meta.reason
  )
    return `${String(meta.reason)} · ${date}`;
  if (e.action === "redemption.requested" && meta.rewardType)
    return `${String(meta.rewardType)} · ${date}`;
  return date;
}

export function Timeline({ entries }: { entries: AuditEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-slate-400">No history yet.</p>;
  }
  return (
    <ol className="relative">
      {entries.map((e, i) => {
        const m = META[e.action] ?? { label: e.action, color: "bg-slate-300" };
        const last = i === entries.length - 1;
        return (
          <li key={e.id} className="relative flex gap-3 pb-5 last:pb-0">
            {!last && (
              <span className="absolute left-[5px] top-3 h-full w-px bg-slate-200" />
            )}
            <span className={cn("relative mt-1 h-2.5 w-2.5 shrink-0 rounded-full", m.color)} />
            <div className="-mt-0.5">
              <p className="font-medium text-slate-900">{m.label}</p>
              <p className="text-sm text-slate-500">{subtitle(e)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
