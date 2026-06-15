import Link from "next/link";
import { Logo } from "@/components/logo";

const WHATSAPP = "https://wa.me/2348142778625";
const TEL = "tel:+2348142778625";

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo href="/" />
            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
              Phone repairs &amp; referral rewards in Abakaliki, Ebonyi State.
              Refer friends, earn cash, airtime or data.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Get started
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/register" className="text-slate-600 hover:text-brand">
                  Create an account
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-600 hover:text-brand">
                  Sign in
                </Link>
              </li>
              <li>
                <a href="#how" className="text-slate-600 hover:text-brand">
                  How it works
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Repairs
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="#trust" className="text-slate-600 hover:text-brand">
                  Our services
                </a>
              </li>
              <li>
                <a href={WHATSAPP} className="text-slate-600 hover:text-brand">
                  WhatsApp us
                </a>
              </li>
              <li>
                <a href={TEL} className="text-slate-600 hover:text-brand">
                  Call us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Visit
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              <li>Abakaliki, Ebonyi State</li>
              <li>Mon–Sat, 9am – 7pm</li>
              <li>+234 814 277 8625</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 sm:flex-row">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Techmykel. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">Powered by Techmykel Repairs</p>
        </div>
      </div>
    </footer>
  );
}
