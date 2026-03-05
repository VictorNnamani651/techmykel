"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Gift, CheckCircle } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const adminNav: NavItem[] = [
  { href: "/admin", label: "Home", icon: <Home size={20} /> },
  {
    href: "/admin/referrals",
    label: "Referrals",
    icon: <ClipboardList size={20} />,
  },
  { href: "/admin/rewards", label: "Rewards", icon: <Gift size={20} /> },
  {
    href: "/admin/redemptions",
    label: "Redeem Q",
    icon: <CheckCircle size={20} />,
  },
];

const referrerNav: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: <Home size={20} /> },
  {
    href: "/dashboard/referrals",
    label: "Referrals",
    icon: <ClipboardList size={20} />,
  },
  { href: "/dashboard/redeem", label: "Redeem", icon: <Gift size={20} /> },
];

interface BottomNavProps {
  role: "ADMIN" | "REFERRER";
}

export default function BottomNav({ role }: BottomNavProps) {
  const pathname = usePathname();
  const items = role === "ADMIN" ? adminNav : referrerNav;

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 480,
        background: "#fff",
        borderTop: "1px solid var(--light-blue)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0.5rem 0 calc(0.5rem + env(safe-area-inset-bottom))",
        boxShadow: "0 -4px 16px rgba(0, 119, 182, 0.1)",
        zIndex: 50,
      }}
    >
      {items.map((item) => {
        const isActive =
          item.href === (role === "ADMIN" ? "/admin" : "/dashboard")
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.2rem",
              textDecoration: "none",
              padding: "0.375rem 1rem",
              borderRadius: "var(--radius-sm)",
              transition: "all 0.2s ease",
              minWidth: 56,
              color: isActive ? "var(--ocean)" : "var(--text-muted)",
            }}
          >
            <span
              style={{
                lineHeight: 1,
                transform: isActive ? "scale(1.15)" : "scale(1)",
                transition: "transform 0.2s ease",
              }}
            >
              {item.icon}
            </span>
            <span
              style={{
                fontSize: "0.6875rem",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "var(--ocean)" : "var(--text-muted)",
                letterSpacing: "0.01em",
              }}
            >
              {item.label}
            </span>
            {isActive && (
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "var(--ocean)",
                  marginTop: 1,
                }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
