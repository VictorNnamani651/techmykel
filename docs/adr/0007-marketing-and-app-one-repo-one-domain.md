# Marketing landing page lives in the same repo and domain as the app

The business needs a public marketing landing page (explain Techmykel, drive
phone-repair custom and referral-platform sign-ups) alongside the existing
referral app. We decided to keep **one Next.js project, one Vercel deploy, one
domain** rather than splitting the landing page into a separate repo/site.

The landing page becomes `/` (replacing the old welcome-splash card, whose
Register/Sign-in CTAs are absorbed into the landing hero/header). It lives in a
dedicated `(marketing)` route group with its own nested layout, kept fully
static (no DB, no session read) so Vercel serves it from the CDN. The app stays
at `/register`, `/login`, `/dashboard`, `/admin`, etc.

## Why

- **Shared design system already exists** (`components/`, brand/gold tokens in
  `globals.css`, `Logo`, Geist font). A separate repo would force duplicating or
  packaging it — real overhead for a single-admin business.
- **`proxy.ts` already treats `/` as public** and only guards app routes, so a
  marketing group drops in with no auth rework.
- **One apex domain** keeps all SEO/trust signal together and makes
  "sign up for the referral platform" a same-origin `/register` click — no
  cross-domain handoff, second SSL/DNS, or cookie seam.
- **No speed penalty**: Next.js per-route code-splitting means landing visitors
  never download app/referrer/admin bundles, and server-only deps
  (`drizzle-orm`, `@neondatabase/serverless`, `jose`) never reach the browser.

## Consequences

- Marketing and app share the root `app/layout.tsx` and one build. Guardrail:
  keep the root layout minimal and never import session/DB/heavy-client code into
  shared layouts, or the static landing page inherits weight it doesn't need.
- Logged-in users visiting `/` still see the landing page (header swaps to "Go to
  dashboard") — we deliberately do **not** auto-redirect, so `/` stays static and
  publicly shareable/crawlable regardless of session.

## Considered and rejected

- **Separate repo + separate domain** for the landing page. Only pays off with a
  separate marketing team, a CMS (WordPress/Webflow), or divergent release
  cadence — none apply to a solo operator. Rejected for duplication cost and
  cross-domain friction.
