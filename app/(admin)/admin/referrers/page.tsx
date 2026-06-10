import Link from "next/link";
import { listReferrers } from "@/lib/queries";
import { Avatar, Card, EmptyState } from "@/components/ui";
import { Icon } from "@/components/icon";
import { Pagination } from "@/components/pagination";
import { formatDate } from "@/lib/format";
import { formatNgPhone } from "@/lib/phone";

export const metadata = { title: "Referrers — Techmykel Admin" };

export default async function AdminReferrersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() || undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const { rows, total, pageSize } = await listReferrers({ search: q, page });

  const hrefFor = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return `/admin/referrers${s ? `?${s}` : ""}`;
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Referrers</h1>
        <p className="mt-1 text-sm text-slate-500">
          {total} registered referrer{total === 1 ? "" : "s"}.
        </p>
      </div>

      <form action="/admin/referrers" className="relative w-full md:max-w-sm">
        <Icon
          name="search"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400"
        />
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by name or phone"
          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </form>

      {rows.length === 0 ? (
        <EmptyState icon={q ? "search_off" : "contacts"} title="No referrers found">
          {q
            ? "Try a different name or phone number."
            : "Referrer accounts will appear here once people sign up."}
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <Link
              key={r.id}
              href={`/admin/referrers/${r.id}`}
              className="block"
            >
              <Card className="flex items-center gap-3 p-4 transition hover:border-brand/40 hover:bg-slate-50">
                <Avatar name={r.fullName} className="h-11 w-11" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-slate-900">{r.fullName}</p>
                    {r.converted && (
                      <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">
                        Converted
                      </span>
                    )}
                  </div>
                  <p className="truncate text-sm text-slate-500">{formatNgPhone(r.phone)}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {r.total} referral{r.total === 1 ? "" : "s"} · {r.successful} successful ·
                    joined {formatDate(r.createdAt)}
                  </p>
                </div>
                <Icon name="chevron_right" className="shrink-0 text-[22px] text-slate-300" />
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Pagination page={page} total={total} pageSize={pageSize} hrefFor={hrefFor} />
    </div>
  );
}
