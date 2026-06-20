import Image from "next/image";
import Link from "next/link";
import { cn } from "@/components/ui";

export function LogoMark({
  className,
  px = 36,
  src = "/techmykel-mark.png",
  altSrc,
  showAlt = false,
}: {
  className?: string;
  px?: number;
  src?: string;
  altSrc?: string;
  showAlt?: boolean;
}) {
  // When an alt mark is supplied, keep both images in the DOM and crossfade
  // between them with CSS opacity. This prevents any swap flash and lets the
  // transition sync with the header background's own duration-300 transition.
  if (altSrc) {
    return (
      <div className="relative shrink-0" style={{ width: px, height: px }}>
        <Image
          src={src}
          alt="Techmykel logo"
          fill
          priority
          className={cn(
            "object-contain transition-opacity duration-300",
            showAlt ? "opacity-0" : "opacity-100",
          )}
        />
        <Image
          src={altSrc}
          alt=""
          fill
          priority
          className={cn(
            "object-contain transition-opacity duration-300",
            showAlt ? "opacity-100" : "opacity-0",
          )}
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt="Techmykel logo"
      width={px}
      height={px}
      priority
      style={{ width: px, height: px }}
      className={cn("object-contain", className)}
    />
  );
}

export function Logo({
  href = "/",
  size = "md",
  showWordmark = true,
  onBrand = false,
  altMarkSrc,
  showAltMark = false,
}: {
  href?: string;
  size?: "sm" | "md";
  showWordmark?: boolean;
  onBrand?: boolean;
  altMarkSrc?: string;
  showAltMark?: boolean;
}) {
  const px = size === "sm" ? 28 : 36;
  const word = size === "sm" ? "text-lg" : "text-xl";
  return (
    <Link href={href} className="inline-flex items-center gap-2">
      <LogoMark px={px} altSrc={altMarkSrc} showAlt={showAltMark} />
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
