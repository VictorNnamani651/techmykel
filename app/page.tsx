import Link from "next/link";
import { AuthShell, AuthCard } from "@/components/auth-shell";
import { Logo } from "@/components/logo";
import { Icon } from "@/components/icon";

export default function WelcomePage() {
  return (
    <AuthShell>
      <AuthCard accent={false}>
        <div className="flex flex-col items-center text-center">
          <Logo href="/" />
          <span className="mt-2 block h-1 w-12 rounded-full bg-gold" />

          <h1 className="mt-8 text-2xl font-bold leading-tight text-brand">
            Refer friends,
            <br />
            earn rewards.
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Send people to the shop for repairs. When they&apos;re sorted, you get
            paid — cash, airtime, or data.
          </p>

          <div className="mt-7 w-full space-y-3">
            <Link
              href="/register"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark active:scale-[0.98]"
            >
              Create an account
              <Icon name="arrow_forward" className="text-[18px]" />
            </Link>
            <Link
              href="/login"
              className="flex w-full items-center justify-center rounded-lg border border-brand/40 px-5 py-3 text-sm font-semibold text-brand transition hover:bg-brand/5 active:scale-[0.98]"
            >
              Sign in
            </Link>
          </div>

          <div className="mt-7 w-full border-t border-slate-100 pt-4">
            <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <Icon name="verified_user" className="text-[14px]" />
              Powered by Techmykel Repairs
            </p>
          </div>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
