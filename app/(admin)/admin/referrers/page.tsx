import { listReferrers } from "@/lib/queries";
import { Avatar, Card, EmptyState } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { formatNgPhone } from "@/lib/phone";
import { ResetPasswordButton } from "./reset-password";

export const metadata = { title: "Referrers — Techmykel Admin" };

export default async function AdminReferrersPage() {
  const referrers = await listReferrers();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Referrers</h1>
        <p className="mt-1 text-sm text-slate-500">{referrers.length} registered referrers.</p>
      </div>

      {referrers.length === 0 ? (
        <EmptyState icon="contacts" title="No referrers yet">
          Referrer accounts will appear here once people sign up.
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {referrers.map((r) => (
            <Card key={r.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={r.fullName} className="h-11 w-11" />
                <div className="min-w-0">
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
              </div>
              <div className="shrink-0">
                <ResetPasswordButton userId={r.id} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
