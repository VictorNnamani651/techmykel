# Techmykel — Roadmap & V2 Backlog

This file is the home for work we have **deliberately deferred past V1**. V1 is the controlled
referral-reward lifecycle (see `CONTEXT.md` and `docs/adr/`). Add items here as they come up so
nothing is lost.

---

## V2: Analytics — usage, progress & insights

**Logged:** 2026-06-10 · **Requested by:** owner

### Why
We want to track how the promotion and the app are actually being used, so we can improve **both
the business** (run the promo better, spot what drives successful referrals, control reward cost)
**and the product** (find friction, fix drop-off, prioritise features).

### Important: this is NOT the screen we already have
V1 already ships a **basic business-metrics dashboard** at `/admin/analytics`
(`app/(admin)/admin/analytics/page.tsx`, data from `getAnalytics()` in `lib/queries.ts`):
totals by status, conversion rate, reward cost, total paid, redemptions by type, converted-referrer
count, referrals-this-week bars. **V2 analytics is a deeper layer on top of that**, not a rebuild.

### What V2 should add

**A. Richer business insights (extend the existing dashboard)**
- Trends over time (referrals, successes, payouts) by week/month, with date-range picker.
- The full **conversion funnel**: Unverified → Pending → Successful → Requested → Fulfilled, with
  drop-off % at each stage.
- **Operational speed**: average time-to-verify and time-to-fulfil (we can already derive these from
  `created_at` / `verified_at` / `requested_at` / `resolved_at` and the `audit_log`).
- **Referrer leaderboard**: top referrers by successful referrals and by reward value.
- Reward cost over time and cost-per-successful-referral.
- Rejection/failure reasons breakdown (we already capture `reason`).

**B. Product / usage analytics (new — the main ask)**
- Sign-up funnel and **OTP completion rate** (how many start registration vs finish verification).
- Active users (DAU/WAU/MAU), logins, return rate.
- Per-user activity: referrals created, redemptions, last-active.
- Redemption choice distribution (cash vs airtime vs data) and how it trends.
- Feature usage and **error/failure rates** (e.g. failed SMS sends, blocked anti-farming attempts).
- Where people drop off in each flow.

### Implementation options (decide at V2 planning)
1. **Self-hosted, in Postgres.** Add an `events` table + lightweight `track(event, props)` helper,
   and build views on top. Pros: no third party, data stays in Neon, cheap. Cons: we build the
   dashboards ourselves. Most of the **business** insights (A) need no new instrumentation — the
   data already exists in `referrals`, `redemptions`, and the immutable `audit_log`.
2. **Third-party product analytics** (e.g. PostHog, Plausible, Umami). Pros: ready-made funnels,
   retention, session views with little code. Cons: another vendor, and PII/privacy handling.

A pragmatic split: do **(A)** in-app from existing data first (high value, low effort), then add a
tool or `events` table for **(B)** behavioural tracking.

### Privacy / guardrails (must address in V2)
- Phone numbers are **PII**. Aggregate and anonymise; don't ship raw numbers to any third party.
- Keep analytics **admin-only**, consistent with V1 (referrers never see system-wide data).
- The `audit_log` stays the immutable source of truth — analytics reads from it, never mutates it.

---

## Other deferred ideas (from the original project overview)

Parked for later; not yet scoped:
- WhatsApp integration for referral links.
- Automated airtime/data/cash disbursement (V1 fulfilment is deliberately manual).
- Multi-branch support and staff accounts (V1 is single-admin).
- Reward **wallet** accumulation (V1 is one reward per referral, never pooled — see ADR-0002).
- Expiry dates for rewards.
- SMS notifications for key events (V1 notifications are in-app only; sender is already pluggable).
