import Link from "next/link";
import { listAudit } from "@/lib/queries";
import { Card, EmptyState } from "@/components/ui";
import { Icon } from "@/components/icon";
import { Pagination } from "@/components/pagination";
import { formatDateTime } from "@/lib/format";

export const metadata = { title: "Audit log — Techmykel Admin" };

const ACTION_LABEL: Record<string, string> = {
  "referral.created": "Referral created",
  "referral.verified": "Referral verified",
  "referral.amount_edited": "Reward amount edited",
  "referral.successful": "Marked successful",
  "referral.failed": "Marked failed",
  "referral.rejected": "Referral rejected",
  "redemption.requested": "Redemption requested",
  "redemption.fulfilled": "Redemption fulfilled",
  "redemption.declined": "Redemption declined",
  "redemption.cancelled": "Redemption cancelled",
};

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const { rows, total, pageSize } = await listAudit({ page });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Audit log</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
          <Icon name="lock" className="text-[16px]" />
          Append-only, read-only history. Newest first.
        </p>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon="receipt_long" title="No activity yet" />
      ) : (
        <Card className="overflow-hidden">
          {/* Desktop table */}
          <table className="hidden w-full text-sm md:table">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Change</th>
                <th className="px-4 py-3">Entity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id} className="align-top hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                    {formatDateTime(r.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {r.actorName ?? "System"}
                    <span className="ml-1 text-xs text-slate-400">({r.actorRole ?? "—"})</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {ACTION_LABEL[r.action] ?? r.action}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {r.fromState || r.toState ? (
                      <span>
                        {r.fromState ?? "—"} → {r.toState ?? "—"}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {r.entityType === "referral" ? (
                      <Link
                        href={`/admin/referrals/${r.entityId}`}
                        className="text-brand hover:underline"
                      >
                        referral
                      </Link>
                    ) : (
                      <span className="text-slate-500">{r.entityType}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="divide-y divide-slate-100 md:hidden">
            {rows.map((r) => (
              <div key={r.id} className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">
                    {ACTION_LABEL[r.action] ?? r.action}
                  </p>
                  <span className="text-xs text-slate-400">{formatDateTime(r.createdAt)}</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {r.actorName ?? "System"} ({r.actorRole ?? "—"})
                  {r.fromState || r.toState ? ` · ${r.fromState ?? "—"} → ${r.toState ?? "—"}` : ""}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Pagination
        page={page}
        total={total}
        pageSize={pageSize}
        hrefFor={(p) => `/admin/audit${p > 1 ? `?page=${p}` : ""}`}
      />
    </div>
  );
}
