import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  BatteryCharging,
  Cable,
  CheckCircle2,
  Clock,
  Droplets,
  Headphones,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Unlock,
  UserPlus,
  Users,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";
import { CountUp } from "@/components/marketing/count-up";

export const metadata: Metadata = {
  title: "Techmykel — Refer friends, get paid",
  description:
    "Send people to Techmykel for trusted phone repairs in Abakaliki and earn up to ₦4,000 per referral in cash, airtime or data. Sign up free.",
};

const WHATSAPP = "https://wa.me/2348142778625";
const TEL = "tel:+2348142778625";

// Subtle dot-grid texture, reused from the app's AuthShell, tuned per background.
const dotGrid = (color: string): React.CSSProperties => ({
  backgroundImage: `radial-gradient(circle at 1px 1px, ${color} 1px, transparent 0)`,
  backgroundSize: "24px 24px",
});

export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <EarnYourWay />
      <TrustProof />
      <BeforeAfter />
      <Services />
      <RepairCTA />
      <FinalCTA />
    </>
  );
}

/* ------------------------------------------------------------------ Hero */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#00337f] text-white">
      {/* Background photo: real Techmykel-style repair close-up */}
      <Image
        src="/marketing/hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 object-cover object-center"
      />
      {/* Brand gradient overlay keeps text AA-legible over the photo */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#002b78]/97 via-[#003ea8]/92 to-[#00337f]/70" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#001b45]/70 via-transparent to-transparent" />
      {/* Decorative aurora blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="mk-blob mk-float absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#2563eb]/70" />
        <div className="mk-blob mk-float-slow absolute -right-16 top-20 h-80 w-80 rounded-full bg-[#f5b301]/30" />
      </div>
      {/* Dot texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={dotGrid("#ffffff")}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:pb-28 lg:pt-36">
        {/* Copy. Uses a pure-CSS entrance (mk-rise) rather than scroll-reveal so
            the above-the-fold hero is never gated behind the JS observer. */}
        <div className="text-center lg:text-left">
          <div className="mk-rise">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur">
              <Sparkles size={14} className="text-gold" />
              Earn with Techmykel
            </span>
          </div>

          <div className="mk-rise" style={{ animationDelay: "80ms" }}>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Refer friends.
              <br />
              <span className="text-gold">Get paid.</span>
            </h1>
          </div>

          <div className="mk-rise" style={{ animationDelay: "160ms" }}>
            <p className="mx-auto mt-5 max-w-md text-base leading-7 text-white/80 lg:mx-0 lg:text-lg">
              Send people to Techmykel for phone repairs and earn{" "}
              <span className="font-semibold text-white">up to ₦4,000</span>{" "}
              every time in cash, airtime or data.
            </p>
            <p className="mt-2 text-xs text-white/60">
              Actual reward depends on the repair.
            </p>
          </div>

          <div className="mk-rise" style={{ animationDelay: "240ms" }}>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/register"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3.5 text-base font-bold text-brand-dark shadow-lg shadow-black/20 transition hover:brightness-105 active:scale-[0.98] sm:w-auto"
              >
                Get started, it&apos;s free
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <a
                href="#how"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/30 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/10 sm:w-auto"
              >
                How it works
              </a>
            </div>
          </div>

          <div className="mk-rise" style={{ animationDelay: "320ms" }}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/70 lg:justify-start">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-gold" /> Trusted since
                2022
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-gold" /> 900+ devices
                repaired
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={16} className="text-gold" /> Abakaliki
              </span>
            </div>
          </div>
        </div>

        {/* Glassmorphic "reward earned" mockup, layered over the repair photo. */}
        <div
          className="mk-rise hidden lg:block"
          style={{ animationDelay: "200ms" }}
        >
          <RewardMockup />
        </div>
      </div>

      {/* Soft fade into the next (white) section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-white/0" />
    </section>
  );
}

function RewardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="mk-float rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
        <div className="rounded-2xl bg-white p-5 text-slate-900 shadow-lg">
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

      {/* floating chips */}
      <div className="mk-float-slow absolute -left-6 top-10 rounded-2xl border border-white/20 bg-white/15 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur">
        +1 referral
      </div>
      <div className="mk-float absolute -right-4 bottom-12 flex items-center gap-1.5 rounded-2xl border border-white/20 bg-white/15 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur">
        <Smartphone size={14} className="text-gold" /> Repaired
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

/* -------------------------------------------------------------- Trust proof */

function TrustProof() {
  return (
    <section
      id="trust"
      className="relative overflow-hidden bg-gradient-to-br from-[#004ac6] to-[#00337f] py-20 text-white sm:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={dotGrid("#ffffff")}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wider text-gold">
            Trusted repairs
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            The repairs you can vouch for
          </h2>
          <p className="mt-4 max-w-md text-base leading-7 text-white/80">
            You can only earn by sending people somewhere good. Techmykel has
            been fixing phones in Abakaliki since 2022 — fast, honest, and done
            right.
          </p>
          <p className="mt-3 max-w-md text-base leading-7 text-white/80">
            That trust is what makes referring easy: you already know they will
            be looked after.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <StatTile
              value={<CountUp value={900} suffix="+" />}
              label="Devices repaired"
            />
            <StatTile value="2022" label="Trusted since" />
            <StatTile value="3 ways" label="Cash · Airtime · Data" />
            <StatTile value="Mon–Sat" label="9am – 7pm" />
          </div>
        </Reveal>

        {/* Real workbench photo */}
        <Reveal delay={120}>
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-white/15 shadow-2xl">
              <Image
                src="/marketing/bench.png"
                alt="A Techmykel technician repairing a phone on the workbench"
                width={1408}
                height={768}
                sizes="(min-width: 1024px) 36rem, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 hidden items-center gap-2 rounded-2xl border border-white/15 bg-white px-4 py-3 text-brand shadow-xl sm:flex">
              <ShieldCheck size={20} className="text-success" />
              <span className="text-sm font-bold">Certified repairs</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StatTile({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur">
      <p className="text-3xl font-extrabold tracking-tight text-gold sm:text-4xl">
        {value}
      </p>
      <p className="mt-1 text-sm text-white/75">{label}</p>
    </div>
  );
}

/* ------------------------------------------------------------- Before & after */

const REPAIRS: {
  device: string;
  job: string;
  before: string;
  after: string;
}[] = [
  {
    device: "iPhone 13 Pro Max",
    job: "Back-glass replacement",
    before: "/marketing/ba-13promax-before.jpg",
    after: "/marketing/ba-13promax-after.jpg",
  },
  {
    device: "iPhone 12",
    job: "Back-glass replacement",
    before: "/marketing/ba-12-before.jpg",
    after: "/marketing/ba-12-after.jpg",
  },
];

function BeforeAfter() {
  return (
    <section id="work" className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            Our work
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Before &amp; after
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-500">
            Real repairs from our bench, shattered backs brought right back to
            brand-new.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {REPAIRS.map((r, i) => (
            <Reveal key={r.device} delay={i * 120}>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
                <div className="relative grid grid-cols-2 gap-1 bg-slate-200">
                  <figure className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={r.before}
                      alt={`${r.device} with a cracked back before repair`}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-slate-900/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                      Before
                    </span>
                  </figure>
                  <figure className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={r.after}
                      alt={`${r.device} restored after repair at Techmykel`}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover"
                    />
                    <span className="absolute right-3 top-3 rounded-full bg-success px-2.5 py-1 text-xs font-semibold text-white">
                      After
                    </span>
                  </figure>
                  {/* Transformation arrow over the seam */}
                  <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand shadow-lg ring-1 ring-slate-200">
                    <ArrowRight size={20} />
                  </span>
                </div>
                <div className="flex items-center justify-between p-5">
                  <div>
                    <p className="font-bold text-slate-900">{r.device}</p>
                    <p className="text-sm text-slate-500">{r.job}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-success">
                    <CheckCircle2 size={16} /> Repaired
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- Services */

const SERVICES: { icon: LucideIcon; label: string }[] = [
  { icon: Smartphone, label: "Screen replacement" },
  { icon: BatteryCharging, label: "Battery replacement" },
  { icon: Droplets, label: "Water damage" },
  { icon: Cable, label: "Charging port" },
  { icon: Unlock, label: "Software & unlock" },
  { icon: Headphones, label: "Accessories" },
];

function Services() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            What we fix
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Our services
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-500">
            Whatever the issue, our technicians have the expertise to fix it.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.label} delay={(i % 3) * 100}>
              <div className="flex h-full flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 text-center transition hover:-translate-y-1 hover:border-brand/30 hover:bg-white hover:shadow-md">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                  <s.icon size={24} />
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {s.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Repair CTA */

function RepairCTA() {
  return (
    <section id="repair" className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Cracked screen? Dead battery?
                </h2>
                <p className="mt-3 text-base leading-7 text-slate-500">
                  Bring it to Techmykel in Abakaliki and let the experts handle
                  it.
                </p>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={16} className="text-brand" /> Mon–Sat, 9am –
                    7pm
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={16} className="text-brand" /> Abakaliki,
                    Ebonyi State
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-base font-bold text-white shadow-sm transition hover:brightness-105 active:scale-[0.98]"
                >
                  <MessageCircle size={20} /> WhatsApp us
                </a>
                <a
                  href={TEL}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand px-6 py-3.5 text-base font-semibold text-brand transition hover:bg-brand hover:text-white active:scale-[0.98]"
                >
                  <Phone size={20} /> Call us
                </a>
              </div>
            </div>
          </div>
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
