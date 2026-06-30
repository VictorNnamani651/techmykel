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
          sizes={`${px}px`}
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
          sizes={`${px}px`}
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

// Full Techmykel logo lockup (mark + wordmark), trimmed to the artwork.
const LOGO_BLUE = "/techmykel-logo-blue.png";
const LOGO_WHITE = "/techmykel-logo-white.png";
const LOGO_W = 573;
const LOGO_H = 153;

export function Logo({
  href = "/",
  size = "md",
  onBrand = false,
}: {
  href?: string;
  size?: "sm" | "md";
  /** Render the white lockup (for brand/dark backgrounds) instead of blue. */
  onBrand?: boolean;
}) {
  const h = size === "sm" ? 28 : 36;
  const w = Math.round((h * LOGO_W) / LOGO_H);
  // Both colourways are kept in the DOM and crossfaded via opacity so the
  // marketing header can transition blue↔white in sync with its background
  // (duration-300) without any swap flash. Static callers just show blue.
  return (
    <Link
      href={href}
      className="relative inline-block shrink-0"
      style={{ width: w, height: h }}
    >
      <Image
        src={LOGO_BLUE}
        alt="Techmykel"
        fill
        sizes={`${w}px`}
        priority
        className={cn(
          "object-contain transition-opacity duration-300",
          onBrand ? "opacity-0" : "opacity-100",
        )}
      />
      <Image
        src={LOGO_WHITE}
        alt=""
        fill
        sizes={`${w}px`}
        priority
        className={cn(
          "object-contain transition-opacity duration-300",
          onBrand ? "opacity-100" : "opacity-0",
        )}
      />
    </Link>
  );
}
