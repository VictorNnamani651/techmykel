"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icon";
import { cn } from "@/components/ui";

export type NavItem = { href: string; label: string; icon: string; exact?: boolean };

function useActive(href: string, exact?: boolean) {
  const path = usePathname();
  return exact ? path === href : path === href || path.startsWith(`${href}/`);
}

export function SidebarLink({ item }: { item: NavItem }) {
  const active = useActive(item.href, item.exact);
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
        active ? "bg-brand/10 text-brand" : "text-slate-600 hover:bg-slate-100",
      )}
    >
      <Icon name={item.icon} filled={active} className="text-[22px]" />
      <span>{item.label}</span>
    </Link>
  );
}

export function BottomLink({ item, badge }: { item: NavItem; badge?: number }) {
  const active = useActive(item.href, item.exact);
  return (
    <Link
      href={item.href}
      className={cn(
        "relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[11px] font-semibold transition",
        active ? "bg-brand/10 text-brand" : "text-slate-500",
      )}
    >
      <Icon name={item.icon} filled={active} className="text-[24px]" />
      {item.label}
      {badge ? (
        <span className="absolute right-4 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
          {badge > 9 ? "9+" : badge}
        </span>
      ) : null}
    </Link>
  );
}
