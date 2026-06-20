"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/components/ui";

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#earn", label: "Rewards" },
  { href: "#trust", label: "Repairs" },
  { href: "#repair", label: "Contact" },
];

export function MarketingHeader() {
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
        <Logo
          href="/"
          onBrand={!solid}
          altMarkSrc="/techmykel-mark-white.png"
          showAltMark={!solid}
        />

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors",
                solid
                  ? "text-slate-600 hover:text-brand"
                  : "text-white/80 hover:text-white",
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
              solid
                ? "text-brand hover:bg-brand/5"
                : "text-white hover:bg-white/10",
            )}
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-gold px-4 py-2 text-sm font-bold text-brand-dark shadow-sm transition hover:brightness-105 active:scale-[0.98]"
          >
            Get started
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors md:hidden",
            solid ? "text-slate-700 hover:bg-slate-100" : "text-white hover:bg-white/10",
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
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-gold px-4 py-2.5 text-center text-sm font-bold text-brand-dark shadow-sm"
            >
              Get started — it&apos;s free
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
