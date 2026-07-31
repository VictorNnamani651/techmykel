import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  ChevronDown,
  Smartphone,
  Sparkles,
  UserPlus,
  Users,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";

// The Refer & Earn programme (ADR-0009). Deliberately its own route rather than
// a section on /: the business leads with repairs, and this stays discoverable
// without being led with. Registration is the programme's only funnel — there
// are no referral links or codes — so this page has to sell properly.
export const metadata: Metadata = {
  title: "Refer & Earn",
  description:
    "Send people to Techmykel for phone repairs in Abakaliki and earn up to ₦4,000 per successful referral in cash, airtime or data. Free to join.",
};

const dotGrid = (color: string): React.CSSProperties => ({
  backgroundImage: `radial-gradient(circle at 1px 1px, ${color} 1px, transparent 0)`,
  backgroundSize: "24px 24px",
});

export default function ReferPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <EarnYourWay />
      <Faq />
      <FinalCTA />
    </>
  );
}

/* ------------------------------------------------------------------ Hero */

// Deliberately a LIGHT hero, unlike every other hero on the site. / and /refer
// were near-indistinguishable while both used the deep-blue gradient — clicking
// through read as scrolling back to the top rather than changing page. The
// palette is blue and gold only, so the differentiator has to be value (light vs
// dark) rather than hue. This reuses the AuthShell surface (slate-50 + slate dot
// grid) that /login and /register already sit on, so /refer visually rhymes with
// the signup flow it exists to feed.
function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={dotGrid("#cbd5e1")}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:pb-28 lg:pt-36">
        <div className="text-center lg:text-left">
          <div className="mk-rise">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 shadow-sm">
              <Sparkles size={14} className="text-[#b97e00]" />
              Refer &amp; Earn
            </span>
          </div>

          <div className="mk-rise" style={{ animationDelay: "80ms" }}>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Refer friends.
              <br />
              {/* Brand blue, not gold: gold (#f5b301) on a light surface is
                  ~1.9:1 contrast, far below the 4.5:1 AA minimum. */}
              <span className="text-brand">Get paid.</span>
            </h1>
          </div>

          <div className="mk-rise" style={{ animationDelay: "160ms" }}>
            <p className="mx-auto mt-5 max-w-md text-base leading-7 text-slate-500 lg:mx-0 lg:text-lg">
              Send people to Techmykel for phone repairs and earn{" "}
              <span className="font-semibold text-slate-900">up to ₦4,000</span>{" "}
              every time in cash, airtime or data.
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Actual reward depends on the repair.
            </p>
          </div>

          <div className="mk-rise" style={{ animationDelay: "240ms" }}>
            {/* See / — items-center alone leaves the buttons left-aligned in the
                sm–lg band while the copy above them is centred. */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/register"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark active:scale-[0.98] sm:w-auto"
              >
                Get started, it&apos;s free
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <a
                href="#how"
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 sm:w-auto"
              >
                How it works
              </a>
            </div>
          </div>

          <div className="mk-rise" style={{ animationDelay: "320ms" }}>
            <p className="mt-8 text-sm text-slate-500">
              Not here to refer anyone?{" "}
              <Link href="/" className="font-semibold text-brand hover:underline">
                See our repair services
              </Link>
            </p>
          </div>
        </div>

        {/* "Reward earned" mockup. */}
        <div
          className="mk-rise hidden lg:block"
          style={{ animationDelay: "200ms" }}
        >
          <RewardMockup />
        </div>
      </div>
    </section>
  );
}

function RewardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* No glassmorphic frame — there is no dark field to glass over on a light
          hero. One plain elevated white card, not a card inside a frame. */}
      <div className="mk-float rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/50">
        <div className="rounded-3xl bg-white p-6 text-slate-900">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-success/10 text-success">
              <CheckCircle2 size={24} />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Reward ready
              </p>
              <p className="text-xs text-slate-500">Referral successful</p>
            </div>
          </div>
          <div className="mt-5">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              You earned
            </p>
            <p className="text-4xl font-extrabold tracking-tight text-brand">
              ₦4,000
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            {["Cash", "Airtime", "Data"].map((t) => (
              <span
                key={t}
                className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-brand py-2.5 text-center text-sm font-semibold text-white">
            Redeem reward
          </div>
        </div>
      </div>

      {/* Floating chips, pinned to the card's corners. Opaque on an opaque card,
          so they must clear the content — the old translucent versions could sit
          over it because the dark hero showed through them. */}
      <div className="mk-float-slow absolute -left-7 -top-4 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-brand shadow-lg">
        +1 referral
      </div>
      <div className="mk-float absolute -bottom-4 -right-5 flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg">
        <Smartphone size={14} className="text-[#b97e00]" /> Repaired
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- How it works */

const STEPS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: UserPlus,
    title: "Sign up free",
    body: "Create your account in under a minute — no fees, no catch.",
  },
  {
    icon: Users,
    title: "Refer someone",
    body: "Tell a friend to bring their phone to Techmykel, then add them in the app.",
  },
  {
    icon: Banknote,
    title: "Get paid",
    body: "Once their repair is done, claim your reward as cash, airtime or data.",
  },
];

function HowItWorks() {
  return (
    <section id="how" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How you earn
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-500">
            Three simple steps between you and your first reward.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 120}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <span className="absolute inset-x-0 top-0 h-1 bg-gold" />
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                    <step.icon size={24} />
                  </span>
                  <span className="text-5xl font-black leading-none text-slate-100">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Earn your way */

const REWARDS: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Banknote, title: "Cash", body: "Straight payout, your way." },
  { icon: Smartphone, title: "Airtime", body: "Topped up on any network." },
  { icon: Wifi, title: "Data", body: "Data worth your reward amount." },
];

function EarnYourWay() {
  return (
    <section id="earn" className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            Rewards
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Earn your way
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-500">
            Every successful referral earns one reward, up to{" "}
            <span className="font-semibold text-slate-900">₦4,000</span>. You
            choose how you collect it.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {REWARDS.map((r, i) => (
            <Reveal key={r.title} delay={i * 120}>
              <div className="h-full rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-[#b97e00]">
                  <r.icon size={26} />
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {r.title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-500">{r.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">
          One reward per successful referral. Amount is set per repair.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- FAQ */

// Answers are drawn from CONTEXT.md so the page matches the rules the system
// actually enforces — notably: a phone number is referrable exactly once ever,
// and the reward amount is set per referral rather than globally (ADR-0002).
// Native <details> keeps this page static — no client JS, no hydration.
const FAQS: { q: string; a: string }[] = [
  {
    q: "Is it free to join?",
    a: "Yes. Creating an account is free and there are no fees at any point. You need a phone number you can receive a code on, and that is it.",
  },
  {
    q: "How do I refer someone?",
    a: "Tell them to bring their phone to Techmykel, then add their name and phone number in the app. When they walk in, we match them to your referral by that phone number — so make sure it is the number they will actually give us.",
  },
  {
    q: "How much do I earn per referral?",
    a: "Techmykel sets the amount for each referral based on the repair, up to ₦4,000. You will see your amount in the app once the referral is confirmed — it is not a flat rate, because repairs differ.",
  },
  {
    q: "When can I collect my reward?",
    a: "Once we have confirmed the referral is genuine and the repair has been completed and paid for. Your reward then becomes available to redeem in the app.",
  },
  {
    q: "What if the person never comes in?",
    a: "Then there is no reward for that referral — but nothing is lost, and you can refer other people. You only earn on repairs that are actually completed and paid for.",
  },
  {
    q: "Can the same person be referred twice?",
    a: "No. A phone number can be referred once, ever. Repeat customers coming back for another repair do not create a new referral.",
  },
  {
    q: "How do I actually get the money?",
    a: "Choose cash, airtime or data when you redeem, and Techmykel sends it to you directly. The amount is the same either way — data means data worth your reward amount.",
  },
];

function Faq() {
  return (
    <section id="faq" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            Questions
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Common questions
          </h2>
        </Reveal>

        <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={Math.min(i, 4) * 70}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-slate-900 marker:hidden [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown
                    size={20}
                    className="shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="mt-3 pr-8 text-sm leading-7 text-slate-500">
                  {f.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <p className="text-sm text-slate-500">
            Still unsure?{" "}
            <a
              href="https://wa.me/2348142778625"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand hover:underline"
            >
              Ask us on WhatsApp
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- Final CTA */

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0052d6] via-[#004ac6] to-[#00337f] py-20 text-white sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={dotGrid("#ffffff")}
      />
      <div className="mk-blob mk-float-slow pointer-events-none absolute -right-10 top-0 h-64 w-64 rounded-full bg-[#f5b301]/30" />
      <Reveal className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Start earning today
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-white/80">
          It is free to join. Refer your first customer this week and turn trust
          into rewards.
        </p>
        <Link
          href="/register"
          className="group mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-7 py-4 text-base font-bold text-brand-dark shadow-lg shadow-black/20 transition hover:brightness-105 active:scale-[0.98]"
        >
          Create your free account
          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </Reveal>
    </section>
  );
}
