import Link from "next/link";
import { Icon } from "@/components/icon";

export function BackHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center gap-3">
      <Link
        href={href}
        aria-label="Back"
        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100"
      >
        <Icon name="arrow_back" className="text-[22px]" />
      </Link>
      <h1 className="text-xl font-bold tracking-tight text-brand">{title}</h1>
    </div>
  );
}
