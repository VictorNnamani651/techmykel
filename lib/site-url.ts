// Single source of truth for the site's absolute base URL, used by metadataBase
// (OG/Twitter image resolution) and by admin alert deep-links.
//
// Hardened deliberately: NEXT_PUBLIC_SITE_URL="techmykel.com" — a bare domain
// with no scheme — took down an entire production build, because `new URL()`
// throws at module scope in app/layout.tsx and that kills page-data collection
// for every route. One mistyped environment variable should not be able to do
// that, so a missing scheme is repaired and an unusable value falls back rather
// than throwing.
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (raw) {
    const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try {
      const url = new URL(withScheme);
      // URL parsing is lenient enough to accept junk like "ht!tp://bad url" and
      // hand back a nonsense origin, so sanity-check the host before trusting it.
      const host = url.hostname;
      const plausible =
        /^[a-z0-9.-]+$/i.test(host) && (host.includes(".") || host === "localhost");
      if (!plausible) throw new Error(`implausible host: ${host}`);
      // .origin normalises away stray trailing slashes and paths.
      return url.origin;
    } catch {
      console.error(
        `NEXT_PUBLIC_SITE_URL is not a usable URL (${raw}) — falling back.`,
      );
    }
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}
