import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import { Icon } from "@/components/icon";

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function naira(amount: number | null | undefined): string {
  if (amount == null) return "—";
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white shadow-[0_4px_6px_-2px_rgba(0,0,0,0.03)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Label({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-slate-700"
    >
      {children}
    </label>
  );
}

const fieldStyles =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(fieldStyles, props.className)} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(fieldStyles, props.className)} />;
}

export function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1.5 text-sm text-red-600">{messages[0]}</p>;
}

export function Alert({
  variant = "info",
  children,
}: {
  variant?: "info" | "error" | "success";
  children: ReactNode;
}) {
  const styles = {
    info: "border-blue-200 bg-blue-50 text-blue-800",
    error: "border-red-200 bg-red-50 text-red-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  } as const;
  const icon = { info: "info", error: "error", success: "check_circle" } as const;
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm",
        styles[variant],
      )}
    >
      <Icon name={icon[variant]} className="text-[18px]" />
      <span>{children}</span>
    </div>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md";
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";
  const sizes = { sm: "px-3 py-1.5 text-[13px]", md: "px-4 py-2.5 text-sm" } as const;
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-dark shadow-sm",
    secondary: "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50",
    danger: "bg-danger text-white hover:bg-red-600",
    ghost: "text-slate-600 hover:bg-slate-100",
    outline: "border border-brand text-brand hover:bg-brand hover:text-white",
  } as const;
  return (
    <button {...props} className={cn(base, sizes[size], variants[variant], className)} />
  );
}

const STATUS_STYLES: Record<string, string> = {
  unverified: "bg-slate-100 text-slate-600",
  pending: "bg-amber-100 text-amber-700",
  successful: "bg-emerald-100 text-emerald-700",
  failed: "bg-slate-100 text-slate-500",
  rejected: "bg-red-100 text-red-700",
  requested: "bg-blue-100 text-blue-700",
  fulfilled: "bg-emerald-100 text-emerald-700",
  declined: "bg-red-100 text-red-700",
  cancelled: "bg-slate-100 text-slate-500",
};

export function Badge({ status, label }: { status: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600",
      )}
    >
      {label ?? status}
    </span>
  );
}

// Round initials avatar from a name.
export function Avatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand",
        className ?? "h-10 w-10",
      )}
    >
      {initials || "?"}
    </span>
  );
}

export function StatCard({
  label,
  value,
  icon,
  accent = "slate",
}: {
  label: string;
  value: ReactNode;
  icon: string;
  accent?: "slate" | "warning" | "success" | "brand" | "info";
}) {
  const bar = {
    slate: "bg-slate-400",
    warning: "bg-warning",
    success: "bg-success",
    brand: "bg-brand",
    info: "bg-info",
  } as const;
  return (
    <Card className="relative overflow-hidden p-4">
      <div className="mb-4 flex items-start justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <Icon name={icon} className="text-[20px] text-slate-300" />
      </div>
      <span className="font-display text-2xl font-semibold text-slate-900">{value}</span>
      <span className={cn("absolute bottom-0 left-0 h-1 w-1/3", bar[accent])} />
    </Card>
  );
}

export function PageHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon = "inbox",
  title,
  children,
  action,
}: {
  icon?: string;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white/50 p-10 text-center">
      <Icon name={icon} className="text-4xl text-slate-300" />
      <p className="mt-2 font-medium text-slate-700">{title}</p>
      {children && <p className="mt-1 text-sm text-slate-500">{children}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
