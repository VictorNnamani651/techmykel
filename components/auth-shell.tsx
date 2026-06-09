import type { ReactNode } from "react";
import { Icon } from "@/components/icon";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}

export function AuthCard({
  children,
  accent = true,
}: {
  children: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {accent && <div className="h-1.5 bg-brand" />}
      <div className="p-6 sm:p-8">{children}</div>
    </div>
  );
}

export function IconBadge({ icon }: { icon: string }) {
  return (
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
      <Icon name={icon} className="text-[28px]" />
    </div>
  );
}

export function AuthHeader({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6 text-center">
      <IconBadge icon={icon} />
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}
