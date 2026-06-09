"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icon";
import { Logo } from "@/components/logo";
import { cn } from "@/components/ui";
import { logout } from "@/app/actions/auth";
import type { NavItem } from "@/components/nav";

export function AdminMobileNav({
  items,
  system,
  adminName,
}: {
  items: NavItem[];
  system: NavItem[];
  adminName: string;
}) {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  const isActive = (it: NavItem) =>
    it.exact ? path === it.href : path === it.href || path.startsWith(`${it.href}/`);

  const renderLink = (it: NavItem) => (
    <Link
      key={it.href}
      href={it.href}
      onClick={() => setOpen(false)}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
        isActive(it) ? "bg-brand/10 text-brand" : "text-slate-600 hover:bg-slate-100",
      )}
    >
      <Icon name={it.icon} filled={isActive(it)} className="text-[22px]" />
      {it.label}
    </Link>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
      >
        <Icon name="menu" className="text-[24px]" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <Logo href="/admin" size="sm" />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
              >
                <Icon name="close" className="text-[22px]" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto">
              {items.map(renderLink)}
              <p className="px-3 pb-1 pt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                System
              </p>
              {system.map(renderLink)}
            </nav>
            <div className="border-t border-slate-200 pt-3">
              <p className="px-3 pb-1 text-sm font-semibold text-slate-700">{adminName}</p>
              <form action={logout}>
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
                  <Icon name="logout" className="text-[22px]" />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
