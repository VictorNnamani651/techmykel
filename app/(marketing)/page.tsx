import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  Cable,
  CheckCircle2,
  Clock,
  Droplets,
  Headphones,
  MapPin,
  MessageCircle,
  Phone,
  ReceiptText,
  Search,
  ShieldCheck,
  Smartphone,
  Unlock,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";
import { CountUp } from "@/components/marketing/count-up";

// Techmykel is a phone-repair business first (ADR-0009). This page sells the
// repairs and converts to WhatsApp/call; the Refer & Earn programme lives at
// /refer, reachable from one quiet strip at the bottom and from the footer.
// Title and description are inherited from the root layout, which is already
// the business default — no per-page metadata needed here.

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
      <Services />
      <BeforeAfter />
      <TrustProof />
      <RepairCTA />
      <ReferStrip />
    </>
  );
}

/* ------------------------------------------------------------------ Hero */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#00337f] text-white">
      {/* Background photo: real Techmykel repair close-up */}
      <Image
        src="/marketing/hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 object-cover object-center"
      />
      {/* Brand gradient overlay keeps text AA-legible over the photo. It is
          darkest on the left, under the copy, and lightest on the right where
          the repair card sits. */}
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
        {/* Uses a pure-CSS entrance (mk-rise) rather than scroll-reveal so the
            above-the-fold hero is never gated behind the JS observer. */}
        {/* Centred until lg, left-aligned once the two-column layout kicks in.
            Without mx-auto the max-w-xl box hugs the left edge while its own
            text centres inside it — everything looks off-centre at tablet. */}
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
          <div className="mk-rise">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur">
              <Wrench size={14} className="text-gold" />
              Trusted phone repairs · Abakaliki
            </span>
          </div>

          <div className="mk-rise" style={{ animationDelay: "80ms" }}>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Your phone,
              <br />
              <span className="text-gold">fixed right.</span>
            </h1>
          </div>

          <div className="mk-rise" style={{ animationDelay: "160ms" }}>
            <p className="mx-auto mt-5 max-w-md text-base leading-7 text-white/80 lg:mx-0 lg:text-lg">
              Screens, batteries, water damage and more — repaired by technicians
              who have been doing this in Abakaliki since 2022.
            </p>
            <p className="mt-2 text-xs text-white/60">
              Free diagnosis. No fix, no fee.
            </p>
          </div>

          <div className="mk-rise" style={{ animationDelay: "240ms" }}>
            {/* items-center only centres the cross axis; once sm:flex-row makes
                the main axis horizontal it needs justify-center too, or the
                buttons drift left while the copy above them stays centred. */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3.5 text-base font-bold text-brand-dark shadow-lg shadow-black/20 transition hover:brightness-105 active:scale-[0.98] sm:w-auto"
              >
                <MessageCircle size={18} />
                WhatsApp us
              </a>
              <a
                href="#work"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/30 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/10 sm:w-auto"
              >
                See our work
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

        {/* Glassmorphic "repair complete" card, layered over the photo. Mirrors
            RewardMockup on /refer: each hero carries one card stating what that
            page is about — a repair here, a reward there. */}
        <div
          className="mk-rise hidden lg:block"
          style={{ animationDelay: "200ms" }}
        >
          <RepairMockup />
        </div>
      </div>

      {/* Soft fade into the next (white) section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-white/0" />
    </section>
  );
}

// A real repair from /public/marketing, shown as proof in the first screen
// rather than 400px down. Chips carry only claims the business confirmed.
function RepairMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="mk-float rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
        <div className="rounded-2xl bg-white p-4 text-slate-900 shadow-lg">
          <div className="relative grid grid-cols-2 gap-1 overflow-hidden rounded-xl bg-slate-200">
            <figure className="relative aspect-3/4 overflow-hidden">
              <Image
                src="/marketing/ba-13promax-before.jpg"
                alt="iPhone 13 Pro Max with a cracked back before repair"
                fill
                sizes="180px"
                className="object-cover"
              />
              <span className="absolute left-2 top-2 rounded-full bg-slate-900/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                Before
              </span>
            </figure>
            <figure className="relative aspect-3/4 overflow-hidden">
              <Image
                src="/marketing/ba-13promax-after.jpg"
                alt="iPhone 13 Pro Max restored after repair at Techmykel"
                fill
                sizes="180px"
                className="object-cover"
              />
              <span className="absolute right-2 top-2 rounded-full bg-success px-2 py-0.5 text-[10px] font-semibold text-white">
                After
              </span>
            </figure>
            <span className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand shadow-lg ring-1 ring-slate-200">
              <ArrowRight size={16} />
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                iPhone 13 Pro Max
              </p>
              <p className="truncate text-xs text-slate-500">
                Back-glass replacement
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
              <CheckCircle2 size={14} /> Repaired
            </span>
          </div>
        </div>
      </div>

      {/* Pinned to the card's corners so they clear the content inside it. */}
      <div className="mk-float-slow absolute -left-7 -top-4 rounded-2xl border border-white/20 bg-white/15 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur">
        Free diagnosis
      </div>
      <div className="mk-float absolute -bottom-4 -right-5 flex items-center gap-1.5 rounded-2xl border border-white/20 bg-white/15 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur">
        <ShieldCheck size={14} className="text-gold" /> No fix, no fee
      </div>
    </div>
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

// How we work, in place of a price list: repair cost tracks device model, part
// availability and FX, so a published price goes stale and costs trust
// (ADR-0009). No warranty claim — the business does not offer one yet.
const PROMISES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Search,
    title: "Free diagnosis",
    body: "We find out what is actually wrong at no cost to you.",
  },
  {
    icon: ReceiptText,
    title: "Quote before we start",
    body: "You know the price up front — no surprise bill at collection.",
  },
  {
    icon: ShieldCheck,
    title: "No fix, no fee",
    body: "If we cannot repair it, you do not pay.",
  },
  {
    icon: Wrench,
    title: "Quality parts",
    body: "No cheap replacements that fail a month later.",
  },
];

function Services() {
  return (
    <section id="services" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            What we fix
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Our services
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-500">
            Android or iPhone, cracked or dead — if it is a phone, bring it in.
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

        <div className="mt-16 grid gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map((p, i) => (
            <Reveal key={p.title} delay={(i % 4) * 90}>
              <div className="flex h-full gap-3.5">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-[#b97e00]">
                  <p.icon size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">{p.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {p.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-slate-500">
          Prices depend on the device and the part.{" "}
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand hover:underline"
          >
            Message us for a quote
          </a>
          .
        </p>
      </div>
    </section>
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
            Why Techmykel
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Repairs you can actually trust
          </h2>
          <p className="mt-4 max-w-md text-base leading-7 text-white/80">
            Techmykel has been fixing phones in Abakaliki since 2022 — fast,
            honest, and done right. We tell you what is wrong before we touch
            anything, and what it will cost before we start.
          </p>
          <p className="mt-3 max-w-md text-base leading-7 text-white/80">
            Quality parts, never cheap replacements. Your phone leaves working
            the way it should.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <StatTile
              value={<CountUp value={900} suffix="+" />}
              label="Devices repaired"
            />
            <StatTile value="2022" label="Trusted since" />
            <StatTile value="Free" label="Diagnosis & quote" />
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

/* --------------------------------------------------------------- Refer strip */

// Deliberately quiet, and deliberately *below* RepairCTA: a referral pitch met
// before the repair ask would undo the repositioning (ADR-0009).
function ReferStrip() {
  return (
    <section className="bg-white py-14">
      <Reveal className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Sent someone to us? Get rewarded.
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Tell a friend to bring their phone in, and earn cash, airtime or
              data once the repair is done.
            </p>
          </div>
          <Link
            href="/refer"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
          >
            How Refer &amp; Earn works
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
