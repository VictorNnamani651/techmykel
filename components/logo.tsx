import Image from "next/image";
import Link from "next/link";
import { cn } from "@/components/ui";

// The Techmykel mark: the brand "m" icon (transparent PNG extracted from the logo).
export function LogoMark({
  className,
  px = 36,
}: {
  className?: string;
  px?: number;
}) {
  return (
    <Image
      src="/techmykel-mark.png"
      alt="Techmykel logo"
      width={px}
      height={px}
      priority
      className={cn("object-contain", className)}
    />
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
  const px = size === "sm" ? 28 : 36;
  const word = size === "sm" ? "text-lg" : "text-xl";
  return (
    <Link href={href} className="inline-flex items-center gap-2">
      <LogoMark px={px} />
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
