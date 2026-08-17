import Link from "next/link";
import { listAllRedemptions } from "@/lib/queries";
import type { RedemptionStatus } from "@/lib/db/schema";
import { Badge, Card, EmptyState, cn, naira } from "@/components/ui";
import { Icon } from "@/components/icon";
import { Pagination } from "@/components/pagination";
import { formatDate } from "@/lib/format";
import { formatNgPhone } from "@/lib/phone";
import { RedemptionActions } from "./redemption-actions";

export const metadata = { title: "Redemptions — Techmykel Admin" };

const STATUSES: RedemptionStatus[] = ["requested", "fulfilled", "declined", "cancelled"];

function isStatus(v?: string): v is RedemptionStatus {
  return !!v && (STATUSES as string[]).includes(v);
}

const TYPE_ICON: Record<string, string> = {
  cash: "account_balance_wallet",
  airtime: "smartphone",
  data: "wifi",
};

export default async function AdminRedemptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const status = isStatus(sp.status) ? sp.status : undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const { rows, total, pageSize } = await listAllRedemptions({ status, page });

  const qs = (over: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams();
    const merged = { status, page, ...over };
    if (merged.status) p.set("status", String(merged.status));
    if (merged.page && Number(merged.page) > 1) p.set("page", String(merged.page));
    const s = p.toString();
    return `/admin/redemptions${s ? `?${s}` : ""}`;
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Redemptions</h1>
        <p className="mt-1 text-sm text-slate-500">Pay the reward, then mark it fulfilled.</p>
      </div>

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

      {rows.length === 0 ? (
        <EmptyState icon="redeem" title="No redemptions here" />
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {rows.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon name={TYPE_ICON[r.rewardType]} className="text-[20px]" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{r.referrerName}</p>
                    <p className="truncate text-xs text-slate-500">
                      {formatNgPhone(r.referrerPhone)}
                    </p>
                    <p className="mt-0.5 truncate text-xs capitalize text-slate-500">
                      {r.rewardType} · for {r.referredName} · {formatDate(r.requestedAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{naira(r.amount)}</p>
                  <div className="mt-1">
                    <Badge status={r.status} />
                  </div>
                </div>
              </div>

              {/* Where the money actually goes. Shown for every status, not just
                  requested, because the snapshot is the record of where a
                  fulfilled payment went (ADR-0011). */}
              {(r.destinationAccountNumber || r.destinationPhone) && (
                <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs">
                  {r.rewardType === "cash" ? (
                    <dl className="space-y-1">
                      <div className="flex justify-between gap-3">
                        <dt className="text-slate-500">Bank</dt>
                        <dd className="truncate font-medium text-slate-900">
                          {r.destinationBankName}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-slate-500">Account number</dt>
                        <dd className="font-mono font-semibold text-slate-900">
                          {r.destinationAccountNumber}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-slate-500">Account name</dt>
                        <dd className="truncate font-medium text-slate-900">
                          {r.destinationAccountName}
                        </dd>
                      </div>
                    </dl>
                  ) : (
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Send to</span>
                      <span className="font-semibold text-slate-900">
                        {formatNgPhone(r.destinationPhone!)}
                        {r.destinationPhone !== r.referrerPhone && (
                          <span className="ml-1 font-normal text-amber-700">
                            (not their own number)
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {r.status === "requested" && (
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <RedemptionActions redemptionId={r.id} />
                </div>
              )}
              {r.status === "declined" && r.declineReason && (
                <p className="mt-3 rounded-lg bg-red-50 p-2.5 text-sm text-red-700">
                  {r.declineReason}
                </p>
              )}
              {(r.status === "fulfilled" || r.status === "cancelled") && r.resolvedAt && (
                <p className="mt-3 text-xs text-slate-400">
                  {r.status === "fulfilled" ? "Fulfilled" : "Cancelled"}{" "}
                  {formatDate(r.resolvedAt)}
                </p>
              )}
            </Card>
          ))}
        </div>
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
