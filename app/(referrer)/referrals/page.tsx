import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { listReferrals } from "@/lib/queries";
import type { ReferralStatus } from "@/lib/db/schema";
import { Badge, Card, EmptyState, cn, naira } from "@/components/ui";
import { Icon } from "@/components/icon";
import { formatDate, maskPhone } from "@/lib/format";

export const metadata = { title: "My referrals — Techmykel" };

const STATUSES: ReferralStatus[] = [
  "unverified",
  "pending",
  "successful",
  "failed",
  "rejected",
];

function isStatus(v: string | undefined): v is ReferralStatus {
  return !!v && (STATUSES as string[]).includes(v);
}

export default async function ReferralsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { status } = await searchParams;
  const active = isStatus(status) ? status : undefined;
  const rows = await listReferrals(user.id, active);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My referrals</h1>
        <Link
          href="/referrals/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
        >
          <Icon name="add" className="text-[18px]" />
          New
        </Link>
      </div>

      {/* Filter chips */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
        <Chip href="/referrals" label="All" active={!active} />
        {STATUSES.map((s) => (
          <Chip
            key={s}
            href={`/referrals?status=${s}`}
            label={s[0].toUpperCase() + s.slice(1)}
            active={active === s}
          />
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon="group"
          title="No referrals here yet"
          action={
            <Link
              href="/referrals/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white"
            >
              <Icon name="add" className="text-[18px]" /> Refer a customer
            </Link>
          }
        >
          Tell a friend about the shop, then log it here.
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <Link key={r.id} href={`/referrals/${r.id}`} className="block">
              <Card className="p-4 transition hover:border-brand/40">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-slate-900">
                      {r.referredName}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-400">
                      {maskPhone(r.referredPhone)}
                    </p>
                  </div>
                  <Badge status={r.status} />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-sm text-slate-500">{formatDate(r.createdAt)}</span>
                  <AmountDisplay status={r.status} amount={r.rewardAmount} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition",
        active
          ? "border-brand bg-brand text-white"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
      )}
    >
      {label}
    </Link>
  );
}

function AmountDisplay({
  status,
  amount,
}: {
  status: ReferralStatus;
  amount: number | null;
}) {
  if (amount == null) return <span className="text-slate-400">—</span>;
  if (status === "successful")
    return <span className="font-semibold text-success">+{naira(amount)}</span>;
  if (status === "rejected" || status === "failed")
    return (
      <span className="font-semibold text-slate-400 line-through">{naira(amount)}</span>
    );
  return <span className="font-semibold text-slate-900">{naira(amount)}</span>;
}
