# The public site leads with the repair business; Refer & Earn is a second route

The marketing site was built referral-first: `/` opened with "Refer friends. Get
paid.", the only primary CTA on the page was `/register`, and the repair content
sat below three referral sections — justified in referral terms rather than on
its own merits. We decided to **split the marketing group into two routes**: `/`
sells phone repairs and converts to WhatsApp/call, and **`/refer`** carries the
referral programme in full. The programme is now discoverable rather than led
with, matching how a business runs an optional earn-on-the-side offer.

## Why

- **The repair business is the business.** Referrals exist to feed it. A landing
  page whose loudest element recruits referrers optimises the second-order goal
  and leaves the first-order one — a stranger in Abakaliki with a cracked screen
  — with no obvious next step.
- **The programme still needs a real sales page.** Registration is its only
  funnel; there are no links or codes. Compressed into one card on `/`, it would
  stop converting entirely. A dedicated route keeps it selling properly while
  keeping it out of the main pitch.
- **Clean SEO split.** `/` targets phone repair in Abakaliki — the traffic that
  earns money. `/refer` targets the programme. The old single title,
  "Techmykel — Refer friends, get paid", competed for neither.
- **Cheap to do.** The 629-line landing page was already built from discrete
  section components, so the split is mostly moving function calls between two
  files.

## Consequences

- The shared `MarketingHeader` hardcoded same-page anchors (`#how`, `#earn`,
  `#trust`, `#repair`) that only exist on one route. It is now route-aware via
  `usePathname()` — nav items and the primary CTA differ per route. A nested
  layout could not do this: `app/(marketing)/refer/layout.tsx` nests *inside* the
  marketing layout and would render a second header.
- `MarketingFooter` links must be absolute (`/#services`, `/refer`), never bare
  fragments, since it renders on both routes.
- OG images are per-route. `openGraph` fields inherit into nested segments, so
  `/refer` needs its own `opengraph-image.tsx` or it silently inherits `/`'s.
  This matters more than usual here: WhatsApp is the main share channel, and the
  old card said "Refer friends. Get paid." to anyone sent a link to the shop.
- Root `metadata` now uses a title template so the business name leads across the
  referrer app and admin too, not just marketing.
- **Guardrail:** the referral strip on `/` must stay *below* `RepairCTA`. A
  referral pitch encountered before the repair ask undoes this decision no matter
  how small the strip is.

## Considered and rejected

- **One reordered page** — services on top, referral demoted to a section. Cheaper,
  and keeps would-be referrers in a single scroll. Rejected because it squeezes
  the programme's only funnel into a card; that is not demotion, it is removal.
- **A header nav link to `/refer`.** The nav is the site's declaration of what it
  is for; an item there reads as a co-equal offer. Rejected for footer + one
  strip low on `/` instead.
- **Footer-only discoverability.** Truest to "you have to go looking", but too
  buried for this business: the people most likely to refer are customers who
  just had a good repair and are already on the page.
- **Publishing a price list.** Repair cost tracks device model, part availability
  and FX. A stale price is worse than none for a shop selling trust — and
  [ADR-0002](./0002-per-referral-reward-amount.md) already made the *reward*
  per-referral for the same reason. Replaced with a process strip: free
  diagnosis, quote before we start, no fix no fee, quality parts.
- **Claiming a warranty.** The business offers none today, so the site claims
  none.
