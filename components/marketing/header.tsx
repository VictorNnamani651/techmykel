"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/components/ui";

const WHATSAPP = "https://wa.me/2348142778625";

// The header renders on both marketing routes, but its nav is same-page anchors
// and its primary CTA differs by audience (ADR-0009): `/` sells repairs and
// converts to WhatsApp; `/refer` sells the programme and converts to /register.
// Driven off usePathname() rather than a nested layout — a layout under
// (marketing) would nest inside it and render a second header.
type HeaderConfig = {
  nav: { href: string; label: string }[];
  cta: { href: string; label: string; external?: boolean };
  // Whether this route's hero is a dark field. Drives the unscrolled text
  // colour: white over /'s blue photo hero, slate over /refer's light one.
  darkHero: boolean;
};

const REPAIRS_CONFIG: HeaderConfig = {
  nav: [
    { href: "#services", label: "Services" },
    { href: "#work", label: "Our work" },
    { href: "#trust", label: "Why us" },
    { href: "#repair", label: "Contact" },
  ],
  cta: { href: WHATSAPP, label: "WhatsApp us", external: true },
  darkHero: true,
};

const REFER_CONFIG: HeaderConfig = {
  nav: [
    { href: "#how", label: "How it works" },
    { href: "#earn", label: "Rewards" },
    { href: "#faq", label: "FAQ" },
  ],
  cta: { href: "/register", label: "Get started" },
  darkHero: false,
};

export function MarketingHeader() {
  const pathname = usePathname();
  const { nav: NAV, cta, darkHero } = pathname?.startsWith("/refer")
    ? REFER_CONFIG
    : REPAIRS_CONFIG;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open, and close it on Escape.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = scrolled || open;
  // Text colour follows the field behind the header, not just scroll state:
  // white would be invisible over /refer's light hero.
  const onDark = darkHero && !solid;

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid
          ? "border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo href="/" onBrand={onDark} />

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors",
                onDark
                  ? "text-white/80 hover:text-white"
                  : "text-slate-600 hover:text-brand",
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
              onDark
                ? "text-white hover:bg-white/10"
                : "text-brand hover:bg-brand/5",
            )}
          >
            Sign in
          </Link>
          {cta.external ? (
            <a
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-gold px-4 py-2 text-sm font-bold text-brand-dark shadow-sm transition hover:brightness-105 active:scale-[0.98]"
            >
              {cta.label}
            </a>
          ) : (
            <Link
              href={cta.href}
              className="rounded-lg bg-gold px-4 py-2 text-sm font-bold text-brand-dark shadow-sm transition hover:brightness-105 active:scale-[0.98]"
            >
              {cta.label}
            </Link>
          )}
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors md:hidden",
            onDark ? "text-white hover:bg-white/10" : "text-slate-700 hover:bg-slate-100",
          )}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>

      {/* Mobile drawer: dimmed backdrop + panel sliding in from the right.
          Rendered as a sibling of <header> (not a child) on purpose: the header
          uses backdrop-blur, and an ancestor with a backdrop-filter becomes the
          containing block for position:fixed descendants — which would collapse
          this full-height panel to the header's box. `inert` (instead of
          aria-hidden) keeps the closed panel unfocusable without trapping focus
          inside a hidden subtree. Both stay mounted so open/close can animate. */}
      <div className="md:hidden" inert={open ? undefined : true}>
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={cn(
            "fixed inset-y-0 right-0 z-70 flex w-[78%] max-w-xs flex-col bg-white shadow-2xl transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
            <Logo href="/" />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100"
            >
              <X size={22} />
            </button>
          </div>
          <nav className="flex flex-col px-4 py-4">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-2 border-t border-slate-100 px-4 py-4">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-brand/30 px-4 py-2.5 text-center text-sm font-semibold text-brand"
            >
              Sign in
            </Link>
            {cta.external ? (
              <a
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-gold px-4 py-2.5 text-center text-sm font-bold text-brand-dark shadow-sm"
              >
                {cta.label}
              </a>
            ) : (
              <Link
                href={cta.href}
                onClick={() => setOpen(false)}
                className="rounded-lg bg-gold px-4 py-2.5 text-center text-sm font-bold text-brand-dark shadow-sm"
              >
                {cta.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
