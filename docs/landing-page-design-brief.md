# Techmykel — Landing Page Design Brief (for Google Stitch)

> **Purpose of this doc:** a self-contained brief to paste into Google Stitch to
> generate the visual design for the Techmykel marketing landing page. It is the
> single source of truth for the page's goal, structure, copy, palette, imagery,
> and motion. Build comes after Stitch produces visuals.
>
> **Architectural context:** this landing page becomes `/` in the existing
> Next.js app (one repo, one domain) — see
> [ADR-0007](adr/0007-marketing-and-app-one-repo-one-domain.md). It must visually
> match the referral platform's design system (palette, fonts, card style below).

---

## 1. The one-line goal

**Convince visitors to sign up for the Techmykel referral platform and start
earning by sending people to a phone-repair shop they can genuinely trust.**

- **Primary conversion:** "Get started / Create account" → `/register`.
- **Secondary conversion:** "Need a repair yourself?" → WhatsApp / Call.
- The repair business is promoted *as the proof* that makes earning believable —
  every earn message implicitly vouches for the repair quality.

**Do NOT** give the repair side a second sign-up button or an equally-weighted
hero CTA — that splits the funnel. Its CTA is a lightweight WhatsApp/Call only.

---

## 2. Audience & message

Two visitor types, one page:

1. **The earner** (primary) — wants to know: how much, how it works, is it legit,
   how do I get paid. Their action is **register**.
2. **The cracked-screen visitor** (secondary) — wants: can you fix it, where, when.
   Their action is **WhatsApp/Call**.

Core promise: *"Refer people to Techmykel for repairs and get paid — cash, airtime
or data — because you already know they'll be looked after."*

---

## 3. Brand system — MATCH THE EXISTING APP EXACTLY

### Colour palette (hex — use verbatim)
| Token | Hex | Use |
|---|---|---|
| Brand blue | `#004ac6` | Primary buttons, headings, hero base, links |
| Brand dark | `#003ea8` | Button hover, deep gradient stops |
| Brand light | `#2563eb` | Gradient highlights, subtle accents |
| **Gold** | `#f5b301` | Accent bars, highlights, "earn" emphasis, stars |
| Success green | `#10b981` | Positive ticks / "paid" states |
| Surface | `#f8fafc` | Page background |
| Ink | `#131b2e` | Body text |
| White | `#ffffff` | Cards |

**Primary scheme:** deep brand-blue backgrounds with **gold as the single accent**
for "earning"/reward emphasis. Blue = trust, gold = reward. Don't introduce new
hues beyond the table above.

### Typography
- **Geist** (sans-serif). Bold, tight-tracked headings; regular 14–16px body.
- Hierarchy: big bold hero H1, section H2s, small uppercase eyebrow labels.

### Visual language (carry over from the app)
- White cards: **`rounded-2xl`**, soft shadow, thin **1px slate border**.
- Signature accent: a thin **gold or blue bar** at the top of feature cards.
- Subtle **dot-grid pattern** background on light sections
  (radial dots, ~24px grid, low opacity) — already used in the app's `AuthShell`.
- Icons: **Material Symbols** (rounded), brand-blue on a `brand/10` tinted square
  badge — matches the app's `IconBadge`.
- Logo: the Techmykel "m" mark + "Techmykel" wordmark (mark asset:
  `/techmykel-mark.png`). White wordmark on dark sections, brand-blue on light.

---

## 4. Overall look & feel

Modern, clean, trustworthy, lightly premium — fintech-meets-local-tech-shop.
Generous whitespace, confident type, **one gold accent doing the heavy lifting**.
Mobile-first and fully responsive (the app is mobile-first; most visitors are on
phones). Sticky slim header. Avoid clutter, stock-corporate vibes, and rainbow
colour.

---

## 5. Page structure (top → bottom)

> Each section lists: **layout**, **copy** (use as-is; `[PLACEHOLDER]`/`[confirm]`
> = fill later), and **imagery/motion**.

### 5.0 Header (sticky, slim)
- Left: Techmykel logo (mark + wordmark). Right: "Sign in" (text link) +
  **"Get started"** (gold-accented or solid brand button → `/register`).
- Transparent over the hero, gains a white background + shadow on scroll.
- *Logged-in state note (for build, not Stitch):* swap "Sign in/Get started" for
  a single "Go to dashboard" button. Design the anonymous state.

### 5.1 Hero — EARN-LED
- **Layout:** full-width, deep brand-blue gradient (`#004ac6` → `#003ea8`),
  dot-grid texture, with a softly-blurred background image (see imagery). Left:
  copy + CTAs. Right (desktop): a phone/visual. Stacks on mobile.
- **Eyebrow:** `EARN WITH TECHMYKEL`
- **H1:** **Refer friends. Get paid.**
- **Sub:** Send people to Techmykel for phone repairs — and earn **up to ₦4,000**
  every time, in cash, airtime or data.
- **Microcopy (small, under sub):** *Actual reward depends on the repair.*
- **Primary CTA:** **Get started — it's free** → `/register` (solid white-on-blue
  or gold button, prominent).
- **Secondary CTA:** "How it works" (ghost button, scrolls down).
- **Trust strip under CTAs:** `Since 2022 · 900+ devices repaired · Abakaliki, Ebonyi`

### 5.2 How it works — 3 steps (EARN, makes it feel easy & legit)
- **Layout:** 3 cards in a row (stack on mobile), each with a numbered gold badge,
  Material Symbol icon, short title + line. Subtle connecting line between them.
- **H2:** How you earn
- **Steps:**
  1. **icon `how_to_reg`** — **Sign up free.** Create your account in under a minute.
  2. **icon `group_add`** — **Refer someone.** Tell a friend to bring their phone
     to Techmykel and add them in the app.
  3. **icon `payments`** — **Get paid.** When their repair's done, claim your
     reward as cash, airtime or data.

### 5.3 What you can earn (EARN, reduces payout doubt)
- **Layout:** a card or band on light/white surface, gold accents. Three small
  reward-type chips/cards: **Cash**, **Airtime**, **Data** (Material Symbols
  `payments`, `smartphone`, `wifi`).
- **H2:** Earn your way
- **Sub:** Every successful referral earns one reward — you choose how you collect
  it: **cash, airtime, or data**, up to ₦4,000.
- **Microcopy:** *One reward per successful referral. Amount set per repair.*

### 5.4 Why people trust Techmykel — REPAIR BUSINESS (the proof)
- **Layout:** two-column on desktop (image left, content right or vice-versa);
  stacked on mobile. Background image of a clean repair workbench (see imagery).
- **Eyebrow:** `TRUSTED REPAIRS`
- **H2:** The repairs you can vouch for
- **Sub:** You can only earn by sending people somewhere good. Techmykel has fixed
  **900+ devices since 2022** in Abakaliki — fast, honest, done right.
- **Stat row (animated count-up):** `2022 Trusted since` · `900+ Devices repaired`
- **Services grid** (6 items, Material Symbol + label):
  - Screen replacement (`smartphone`)
  - Battery replacement (`battery_charging_full`)
  - Water damage (`water_drop`)
  - Charging port (`cable` / `power`)
  - Software & unlock (`lock_open` / `settings`)
  - Accessories (`headphones` / `devices_other`)

### 5.5 Need a repair yourself? — REPAIR CTA (secondary conversion)
- **Layout:** compact band, brand-blue or light card, two buttons side by side.
- **H2:** Cracked screen? Dead battery?
- **Sub:** Bring it to Techmykel, Abakaliki. Open **Mon–Sat, 9am – 7pm**.
- **Buttons:**
  - **WhatsApp us** (green WhatsApp-style) → `https://wa.me/2348142778625`
  - **Call +234 814 277 8625** (outline, brand-blue) → `tel:+2348142778625`
- Keep these visually lighter than the hero's `/register` CTA.

### 5.6 Final CTA — back to EARN
- **Layout:** full-width brand-blue band, dot-grid, centred, gold accent.
- **H2:** Start earning today
- **Sub:** It's free to join. Refer your first customer this week.
- **Button:** **Create your free account** → `/register`

### 5.7 Footer
- Logo + one-liner: *"Techmykel — phone repairs & referral rewards, Abakaliki,
  Ebonyi State."*
- Columns: quick links (Sign in, Get started, How it works), Contact
  (WhatsApp/Call +234 814 277 8625, 9am–7pm), small print.
- *"Powered by Techmykel Repairs"* line (matches current welcome screen).

---

## 6. Imagery — AI-GENERATED by Stitch

Generate atmospheric, on-brand imagery (no real photos required yet; real
Techmykel shop photos can be swapped into the hero & trust sections later).
Style for all: **warm, real, slightly shallow depth of field**, blue-leaning
grade to match the brand, never glossy stock-cliché.

Per-section generation prompts:
- **Hero background:** close-up of skilled hands repairing a smartphone on a tidy
  workbench, small tools and components around, soft bokeh, dark moody lighting —
  to sit *behind* a deep-blue gradient overlay (image stays subtle, text-legible).
- **Trust section:** clean, well-lit repair bench with a phone opened mid-repair,
  precision screwdriver, organised parts trays — conveys competence and care.
- **Reward/earn accents (optional):** abstract gold-and-blue geometric shapes or
  soft glows; no literal money imagery.
- **Service icons:** use Material Symbols (not images) for the 6 services.

Overlay rule: any photo behind text must carry a brand-blue gradient or scrim so
white text stays AA-legible.

---

## 7. Motion / animations (subtle, tasteful)

- **On-scroll reveal:** sections and cards fade + slide up ~16px as they enter
  the viewport. Stagger the 3 "how it works" cards.
- **Count-up:** animate `900+` and `2022` stats when the trust section scrolls in.
- **Hover:** cards lift slightly (shadow + 2–4px rise); buttons darken
  (`#004ac6` → `#003ea8`) and scale `0.98` on press (matches the app's buttons).
- **Hero:** very slow parallax / gentle zoom on the background image; gold accent
  bar can draw in.
- **Header:** smooth transparent→white transition on scroll.
- Keep durations 150–400ms, ease-out. Respect `prefers-reduced-motion` (disable
  non-essential motion). Nothing flashy or distracting from the CTAs.

---

## 8. Responsive

- **Mobile-first.** Hero copy and CTAs stack full-width; CTAs are large tap
  targets. 3-step and services grids collapse to single column. Sticky header
  condenses to logo + a single "Get started" button (hamburger optional).
- Test ~375px, ~768px, ~1280px.

---

## 9. Facts reference (for accurate copy)

| Field | Value |
|---|---|
| Business | Techmykel (phone repair + referral rewards) |
| Location | Abakaliki, Ebonyi State, Nigeria |
| Hours | Mon–Sat, 9am – 7pm |
| Phone & WhatsApp | +234 814 277 8625 (same number) |
| WhatsApp link | `https://wa.me/2348142778625` |
| Trading since | 2022 |
| Devices repaired | 900+ |
| Services | Screen replacement, battery, water damage, charging port, software/unlock, accessories |
| Reward types | Cash, airtime, or data (one per successful referral) |
| Reward hook | "up to ₦4,000" + microcopy "actual reward depends on the repair" |
| Sign-up route | `/register`  ·  Sign-in route: `/login` |
| Warranty/turnaround claims | **None yet — do not invent any** |

> **Honesty guardrails:** don't promise warranties, turnaround times, or fixed
> reward amounts the business hasn't committed to. "Up to ₦4,000" must always
> appear with the "depends on the repair" qualifier.
