import Link from "next/link";
import { listAllReferrals } from "@/lib/queries";
import type { ReferralStatus } from "@/lib/db/schema";
import { Badge, Card, EmptyState, cn, naira } from "@/components/ui";
import { Icon } from "@/components/icon";
import { Pagination } from "@/components/pagination";
import { formatDate } from "@/lib/format";
import { formatNgPhone } from "@/lib/phone";

export const metadata = { title: "Referrals — Techmykel Admin" };

const STATUSES: ReferralStatus[] = [
  "unverified",
  "pending",
  "successful",
  "failed",
  "rejected",
];

function isStatus(v?: string): v is ReferralStatus {
  return !!v && (STATUSES as string[]).includes(v);
}

export default async function AdminReferralsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const status = isStatus(sp.status) ? sp.status : undefined;
  const q = sp.q?.trim() || undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const { rows, total, pageSize } = await listAllReferrals({ search: q, status, page });

  const qs = (over: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams();
    const merged = { status, q, page, ...over };
    if (merged.status) p.set("status", String(merged.status));
    if (merged.q) p.set("q", String(merged.q));
    if (merged.page && Number(merged.page) > 1) p.set("page", String(merged.page));
    const s = p.toString();
    return `/admin/referrals${s ? `?${s}` : ""}`;
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Referrals</h1>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <form action="/admin/referrals" className="relative w-full md:max-w-sm">
          {status && <input type="hidden" name="status" value={status} />}
          <Icon
            name="search"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400"
          />
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search by customer phone or name"
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </form>

        <div className="flex flex-wrap gap-2">
          <Chip href={qs({ status: undefined, page: 1 })} label="All" active={!status} />
          {STATUSES.map((s) => (
            <Chip
              key={s}
              href={qs({ status: s, page: 1 })}
              label={s[0].toUpperCase() + s.slice(1)}
              active={status === s}
            />
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon="search_off" title="No referrals found">
          Try a different search or filter.
        </EmptyState>
      ) : (
        <Card className="overflow-hidden">
          {/* Desktop table */}
          <table className="hidden w-full text-sm md:table">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Referrer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Reward</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{r.referredName}</td>
                  <td className="px-4 py-3 text-slate-500">{formatNgPhone(r.referredPhone)}</td>
                  <td className="px-4 py-3 text-slate-600">{r.referrerName}</td>
                  <td className="px-4 py-3"><Badge status={r.status} /></td>
                  <td className="px-4 py-3 text-slate-700">{naira(r.rewardAmount)}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(r.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/referrals/${r.id}`} className="font-medium text-brand hover:underline">
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="divide-y divide-slate-100 md:hidden">
            {rows.map((r) => (
              <Link key={r.id} href={`/admin/referrals/${r.id}`} className="block p-4 hover:bg-slate-50">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{r.referredName}</p>
                    <p className="truncate text-xs text-slate-500">
                      {formatNgPhone(r.referredPhone)} · {r.referrerName}
                    </p>
                  </div>
                  <Badge status={r.status} />
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-slate-500">{formatDate(r.createdAt)}</span>
                  <span className="font-medium text-slate-700">{naira(r.rewardAmount)}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      <Pagination page={page} total={total} pageSize={pageSize} hrefFor={(p) => qs({ page: p })} />
    </div>
  );
}

function Chip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
        active
          ? "border-brand bg-brand text-white"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
      )}
    >
      {label}
    </Link>
  );
}
