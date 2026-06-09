import Link from "next/link";
import { cn } from "@/components/ui";

// The Techmykel mark: white lowercase "m" in a royal-blue rounded square.
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-lg bg-brand font-bold text-white",
        className,
      )}
    >
      m
    </span>
  );
}

export function Logo({
  href = "/",
  size = "md",
  showWordmark = true,
  onBrand = false,
}: {
  href?: string;
  size?: "sm" | "md";
  showWordmark?: boolean;
  onBrand?: boolean;
}) {
  const mark = size === "sm" ? "h-7 w-7 text-base" : "h-9 w-9 text-xl";
  const word = size === "sm" ? "text-lg" : "text-xl";
  return (
    <Link href={href} className="inline-flex items-center gap-2">
      <LogoMark className={mark} />
      {showWordmark && (
        <span
          className={cn(
            "font-bold tracking-tight",
            word,
            onBrand ? "text-white" : "text-brand",
          )}
        >
          Techmykel
        </span>
      )}
    </Link>
  );
}
