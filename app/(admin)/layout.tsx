import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/dal";
import { Logo } from "@/components/logo";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/ui";
import { SidebarLink, type NavItem } from "@/components/nav";
import { AdminMobileNav } from "@/components/admin-mobile-nav";

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "dashboard", exact: true },
  { href: "/admin/referrals", label: "Referrals", icon: "group" },
  { href: "/admin/redemptions", label: "Redemptions", icon: "redeem" },
  { href: "/admin/referrers", label: "Referrers", icon: "contacts" },
];

const SYSTEM: NavItem[] = [
  { href: "/admin/audit", label: "Audit", icon: "receipt_long" },
  { href: "/admin/analytics", label: "Analytics", icon: "insights" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="border-b border-slate-200 p-6">
          <Logo href="/admin" />
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {NAV.map((item) => (
            <SidebarLink key={item.href} item={item} />
          ))}
          <p className="px-3 pb-1 pt-5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            System
          </p>
          {SYSTEM.map((item) => (
            <SidebarLink key={item.href} item={item} />
          ))}
        </nav>
        <div className="border-t border-slate-200 p-4">
          <div className="mb-1 flex items-center gap-3 px-1">
            <Avatar name={user.fullName} className="h-9 w-9" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user.fullName}
              </p>
              <p className="truncate text-xs text-slate-400">Administrator</p>
            </div>
          </div>
          <form action={logout}>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
              <Icon name="logout" className="text-[22px]" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <Logo href="/admin" size="sm" />
        <AdminMobileNav items={NAV} system={SYSTEM} adminName={user.fullName} />
      </header>

      {/* Main content */}
      <main className="flex-1 md:pl-64">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
