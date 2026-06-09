import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/dal";
import { getUnreadCount } from "@/lib/notifications";
import { Logo } from "@/components/logo";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/ui";
import { BottomLink, SidebarLink, type NavItem } from "@/components/nav";
import { formatNgPhone } from "@/lib/phone";

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/referrals", label: "Referrals", icon: "group" },
  { href: "/redemptions", label: "Redeem", icon: "redeem" },
  { href: "/notifications", label: "Alerts", icon: "notifications" },
];

export default async function ReferrerLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "referrer") redirect("/admin");
  const unread = await getUnreadCount(user.id);

  return (
    <div className="min-h-screen md:flex">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="border-b border-slate-200 p-6">
          <Logo href="/dashboard" />
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {NAV.map((item) => (
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
              <p className="truncate text-xs text-slate-400">
                {formatNgPhone(user.phone)}
              </p>
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
        <Logo href="/dashboard" size="sm" />
        <form action={logout}>
          <button
            aria-label="Sign out"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
          >
            <Icon name="logout" className="text-[22px]" />
          </button>
        </form>
      </header>

      {/* Main content */}
      <main className="flex-1 md:pl-64">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-10">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center gap-1 border-t border-slate-200 bg-white px-2 py-1.5 shadow-[0_-2px_10px_-4px_rgba(0,0,0,0.08)] md:hidden">
        {NAV.map((item) => (
          <BottomLink
            key={item.href}
            item={item}
            badge={item.href === "/notifications" ? unread : undefined}
          />
        ))}
      </nav>
    </div>
  );
}
