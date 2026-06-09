# Techmykel — UI Design Brief (for Google Stitch / Claude Artifacts)

Paste the **Global Style** section once, then generate each screen using its numbered prompt. Screens are grouped by the three audiences. Referrer screens are **mobile-first**; admin screens are **desktop/tablet-first** but should stay responsive.

---

## Product summary

A referral-reward web app for a small **phone-repair business**. Existing customers (**Referrers**) refer new customers by word of mouth and log the referral in the app. The business owner (**Admin**) verifies each referral, sets a cash-value reward, and after the repair is completed and paid, the referral becomes **Successful** and the referrer can **redeem** the reward as cash, airtime, or data. The admin fulfils payouts manually. Everything is auditable.

It is **controlled and admin-managed** — there are no public referral links, no automatic payouts, and no self-service reward calculation.

### Who uses it
- **Referrer** — everyday person on a **phone**. Needs a dead-simple, friendly, reassuring experience. Few taps. Big touch targets.
- **Admin** — the shop owner, often on a **laptop/tablet**. Needs dense, efficient tables, search, and a clear action queue.

---

## Global style

- **Vibe:** clean, modern, trustworthy — "fintech-lite", not flashy. Lots of whitespace, calm, confidence-inspiring (money is involved). Brand is taken from the Techmykel smartphone-repair flyer: a **royal-blue** identity with **gold** accents on white.
- **Primary color:** Royal blue — `#2563EB` (hover `#1D4ED8`). Use for primary buttons, active nav, links, key highlights.
- **Deep navy:** `#1E3A8A` (→ darker `#0F2167`) for headers, hero/gradient backgrounds, and the sidebar. A blue gradient (navy → bright blue `#3B82F6`) echoes the flyer.
- **Accent color:** Gold — `#F5B301`. Use sparingly for emphasis: dividers, the logo underline, active tab indicators, a highlighted CTA detail. Never for large fills or body text.
- **Neutrals:** Slate/zinc scale — text `#0f172a`, secondary text `#64748b`, borders `#e2e8f0`, page background `#f8fafc`, card background `#ffffff`.
- **Support full dark mode** (page `#020617`, card `#0f172a`, borders `#1e293b`, text `#f8fafc`).
- **Status colors (use consistently as pill badges):**
  - Unverified → grey (zinc)
  - Pending → amber/yellow
  - Successful → emerald/green
  - Failed → muted grey
  - Rejected → red
  - Redemption *Requested* → blue
  - Redemption *Fulfilled* → emerald/green
  - Redemption *Declined* → red
  - Redemption *Cancelled* → muted grey
- **Shape & depth:** rounded corners (cards `rounded-xl` ~12px, inputs/buttons `rounded-lg` ~8px), subtle soft shadows, 1px hairline borders.
- **Typography:** clean geometric sans (Geist / Inter). Page titles ~20–24px semibold; body 14px; captions 12px muted.
- **Currency:** Nigerian Naira, formatted like `₦1,000`. Phone numbers shown as `0801 234 5678`.
- **Iconography:** simple line icons (Lucide style).
- **Tone of copy:** warm, plain English. Reassuring for referrers, precise for admins.
- **App name / logo:** the Techmykel mark is a stylized white **"m" monogram** sitting in a royal-blue rounded square (from the flyer). Pair it with the wordmark "**Techmykel**" in royal blue (white when on a blue/navy background), tagline "Referral Rewards", and a short gold underline accent.

### Reusable components
- **Status badge** (pill, colored per the map above, capitalized).
- **Stat card** (big number + label + small icon) for dashboards.
- **Data table** with header row, zebra-free clean rows, a status badge column, and a right-aligned action.
- **Empty state** (dashed border box, muted icon + one line of guidance + a primary action).
- **Toast / inline alert** in three variants: info (blue), error (red), success (green).
- **Bottom tab bar** for referrer mobile navigation; **left sidebar** for admin.
- **Form field**: label above input, helper/validation message below in red on error.

---

## AUTH SCREENS (mobile-first, centered card on a soft background)

### 1. Landing / Welcome — `/`
Simple marketing-lite splash. Centered. "Techmykel — Refer friends, earn rewards." One short sentence: "Send people to the shop for repairs. When they're sorted, you get paid — cash, airtime, or data." Two buttons: **Create an account** (primary) and **Sign in** (secondary). Small footnote: "By invitation of the shop. Rewards are approved and paid by the shop owner."

### 2. Register — `/register`
Centered card titled "Create your account". Fields: **Full name**, **Phone number** (tel, placeholder `0801 234 5678`), **Password** (min 8 chars, with show/hide toggle). Primary full-width button **"Continue"**. Helper text: "We'll text you a 6-digit code to confirm this is your number." Link below: "Already have an account? Sign in." Show inline field errors.

### 3. Verify phone (OTP) — `/register/verify`
Centered card titled "Enter the code". Subtext: "We sent a 6-digit code to **0801 234 5678**." A single **6-digit code input** (large, spaced digit boxes preferred). Primary button **"Verify & continue"**. Below: a muted **"Resend code"** link with a subtle countdown ("Resend in 0:30"). Error state: "Incorrect code. Please try again." This step is required — the account isn't active until verified.

### 4. Sign in — `/login`
Centered card titled "Sign in". Fields: **Phone number**, **Password** (show/hide). Primary full-width **"Sign in"**. Link: "New here? Create an account." Error state (single alert): "Invalid phone number or password."

---

## REFERRER SCREENS (mobile-first; bottom tab bar: Home · Referrals · Redeem · Alerts)

### 5. Referrer dashboard — `/dashboard`
Top: greeting "Hi, Victor 👋". A row/grid of **stat cards**: "Awaiting review" (unverified), "In progress" (pending), "Successful", and a highlighted **"Rewards ready to redeem"** card (royal blue, shows count). Below: a **"Rewards ready"** list — each item shows referred customer name, the reward amount (`₦1,000`), and a **Redeem** button. Prominent floating/primary **"+ New referral"** button. Empty state if no referrals: "You haven't referred anyone yet. Tell a friend about the shop, then log it here."

### 6. My referrals — `/referrals`
Title "My referrals" + **"+ New"** button. Filter chips: All / Unverified / Pending / Successful / Failed / Rejected. A list of cards (mobile) — each shows: referred customer **name**, masked/partial **phone**, a **status badge**, the **date**, and reward amount when set. Tapping a card opens its detail. Empty state per filter.

### 7. New referral — `/referrals/new`
Title "Refer a customer". Short reassurance: "Tell us who you've sent to the shop. The owner will confirm when they arrive." Fields: **Customer's name**, **Customer's phone number** (`0801 234 5678`), **Note (optional)** — placeholder "e.g. cracked iPhone screen". Primary **"Submit referral"**. Helper note in muted text: "Each phone number can only be referred once. You can't refer your own number." Error examples to design for: "This customer has already been referred." / "You can't refer your own number." / "This number belongs to a registered referrer."

### 8. Referral detail — `/referrals/[id]`
Header: customer **name** + **status badge**. A details block: phone, note, date created, reward amount (shown once the admin sets it: "Reward: ₦1,000"). A vertical **status history timeline** (this referral only): e.g. "Submitted · 2 Mar", "Verified — reward ₦1,000 · 3 Mar", "Successful · 3 Mar". If status is **Successful and not yet redeemed**, show a prominent **"Redeem reward"** action that opens a chooser. If a redemption exists, show its current state (e.g. "Redemption requested — airtime" / "Fulfilled").

### 9. Redeem chooser (modal or `/referrals/[id]/redeem`)
Title "Choose how to get your ₦1,000". Three large selectable option cards: **Cash**, **Airtime**, **Data** (each with an icon). Note: "The amount is the same — pick how you'd like it delivered." Primary **"Confirm redemption"**. After submit: confirmation "Request sent — the shop will pay you shortly."

### 10. My redemptions — `/redemptions`
Title "Redemptions". List of redemption records: reward type (cash/airtime/data), amount, status badge (Requested/Fulfilled/Declined/Cancelled), date. For a **Requested** item, show a **"Cancel"** action (so they can re-pick a type). Show decline reason if Declined. Empty state: "No redemptions yet."

### 11. Notifications / Alerts — `/notifications`
Title "Alerts". A simple list, unread items highlighted (royal-blue dot). Examples: "Your referral for Bola was verified — reward ₦1,000.", "Your referral for Bola is now successful — redeem your reward.", "Your redemption was fulfilled. Enjoy!" A "Mark all read" action. Unread count badge appears on the tab bar icon. Empty state: "No alerts yet."

---

## ADMIN SCREENS (desktop/tablet-first; left sidebar nav: Dashboard · Referrals · Redemptions · Referrers · Audit · Analytics; sign out at bottom)

### 12. Admin dashboard / action queue — `/admin`
Title "Today". Top row of **stat cards**: Unverified referrals (to review), Pending, Successful, Open redemption requests, Total rewards owed/paid. Two **action queues** side by side: **"Referrals to verify"** (list with customer name, referrer name, phone, "Review" button) and **"Redemptions to fulfil"** (referrer, type, amount, "Fulfil" button). The point of this screen is: what needs my attention right now.

### 13. Referrals (admin list) — `/admin/referrals`
Title "Referrals". A prominent **search bar**: "Search by customer phone or name" (phone is the primary match key). Status filter dropdown/chips. A dense **data table**: Customer name · Customer phone · Referrer · Status badge · Reward amount · Date · Action ("Open"). Pagination at the bottom.

### 14. Admin referral detail — `/admin/referrals/[id]`
The workhorse screen. Header: customer name + status badge + referrer name. Details panel: phone, note, dates. **Stateful action panel** that changes with status:
- **Unverified:** "Verify this referral" — an amount input (`₦`) labeled "Reward amount", a **"Verify & set reward"** primary button, and a secondary **"Reject"** (with a reason field) for suspected-fake.
- **Pending:** show the set reward with an **"Edit amount"** affordance (allowed only while pending), plus two buttons: **"Mark successful"** (job done + paid) and **"Mark failed"** (with reason).
- **Successful / Failed / Rejected:** read-only outcome; reward amount locked.
Right side or below: full **status-history timeline** with actor + timestamp for each transition. If redeemed, show redemption status here too.

### 15. Redemptions (admin) — `/admin/redemptions`
Title "Redemptions". Filter by status. Table: Referrer · Reward type · Amount · Status · Requested date · Action. For **Requested** rows: **"Mark fulfilled"** (primary) and **"Decline"** (opens a reason field). Fulfilling means the admin already paid cash / sent airtime / sent data manually — the app just records it.

### 16. Referrers (admin) — `/admin/referrers`
Title "Referrers". Table of accounts: Name · Phone · # referrals · # successful · a small **"Converted"** tag if the account was previously a referred customer · Joined date · Action **"Reset password"** (admin-assisted reset — opens a small dialog to set a temporary password).

### 17. Audit log — `/admin/audit`
Title "Audit log". Read-only, system-wide, newest first. Table: Timestamp · Actor (name + role) · Action · Entity (referral/redemption) · From → To state · small details. Emphasize visually that it is **append-only / immutable** (e.g. a subtle "read-only history" note). Filter by entity type and date.

### 18. Analytics — `/admin/analytics`
Title "Analytics". **Stat cards**: total referrals, conversion rate (successful ÷ verified), total reward cost (sum of rewards on successful referrals), total paid out (fulfilled redemptions), and **converted referrers** count (customers who became referrers). Simple **bar visualizations**: referrals by status; redemptions by type (cash vs airtime vs data); referrals over time (by week/month). Keep it clean — cards + simple bars, no clutter.

---

## Cross-cutting states to design
- **Loading skeletons** for tables and cards.
- **Empty states** for every list (friendly, with the relevant primary action).
- **Inline validation errors** under fields; **single alert banner** for form-level errors.
- **Confirmation feedback** after every mutation (toast or inline success).
- **Mobile:** referrer screens must be fully usable one-handed; sticky bottom tab bar; primary actions reachable with the thumb.

## Hard product constraints (reflect in UI, don't contradict)
- No public/shareable referral links anywhere.
- Referrers never see other people's data or the global audit log — only their own referrals, redemptions, alerts.
- The reward **amount** is set by the admin, not chosen by the referrer; the referrer only chooses the **delivery type** (cash/airtime/data).
- Payouts are manual — the app records fulfilment, it never moves money itself.
- Single admin. No admin sign-up screen exists.
