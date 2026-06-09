---
name: Techmykel Design System
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#4059aa'
  on-secondary: '#ffffff'
  secondary-container: '#8fa7fe'
  on-secondary-container: '#1d3989'
  tertiary: '#6f4f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#8e6600'
  on-tertiary-container: '#ffeed5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#b6c4ff'
  on-secondary-fixed: '#00164e'
  on-secondary-fixed-variant: '#264191'
  tertiary-fixed: '#ffdea5'
  tertiary-fixed-dim: '#febb14'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5d4200'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
  bg-main: '#F8FAFC'
  bg-dark-mode: '#020617'
  status-unverified: '#71717A'
  status-pending: '#F59E0B'
  status-successful: '#10B981'
  status-rejected: '#EF4444'
  status-requested: '#3B82F6'
  text-secondary: '#64748B'
  border-light: '#E2E8F0'
  border-dark: '#1E293B'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-uppercase:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max-width: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

The design system is built on a **Corporate / Modern** aesthetic with a "fintech-lite" finish. It prioritizes clarity, trust, and professional reliability to ensure users feel secure when managing rewards and financial data. The brand personality is helpful and reassuring for Referrers, while remaining efficient and systematic for Admins.

The visual language utilizes a "High-Contrast / Professional" mix:
- **Cleanliness:** Ample whitespace and a strict grid system to prevent cognitive overload.
- **Trust:** A dominant Royal Blue palette to evoke stability and institutional authority.
- **Precision:** Fine 1px hairlines and subtle depth to indicate a well-maintained, secure platform.
- **Focus:** Sparse use of Gold accents to guide attention to primary actions and status highlights without distracting from the data.

The UI should feel "lightweight yet sturdy"—moving away from the playfulness of consumer social apps toward the focused utility of a banking or productivity tool.

## Colors

The palette is anchored by **Royal Blue**, used for primary interactions and brand identification. **Deep Navy** provides structural grounding, used primarily for navigation backgrounds and headers to create a "top-heavy" visual hierarchy that feels secure.

**Accentuation & Status:**
- **Gold** is reserved strictly for high-value highlights: the logo underline, active tab indicators, and specific CTA details.
- **Status Colors** are semantically mapped to specific business logic. "Emerald" represents value creation (Success/Fulfilled), "Amber" indicates processing (Pending), and "Blue" signals a user-initiated request.

**Color Mode:**
The system defaults to a clean **Light Mode** for maximum legibility in shop environments, but supports a high-contrast **Dark Mode** for power users (Admins) and modern mobile preferences. In Dark Mode, surfaces shift to a deep navy-black (`#020617`) to maintain brand DNA while reducing eye strain.

## Typography

This design system uses a dual-font approach to balance character with readability. **Geist** is used for headlines to provide a technical, modern edge with its geometric precision. **Inter** is used for all functional text, including body copy and labels, due to its exceptional legibility at small sizes and high x-height.

**Formatting Rules:**
- **Currency:** All Naira values (`₦`) should use a tabular-nums font feature where possible to ensure alignment in tables.
- **Weight:** Use Semibold (600) for hierarchy, avoiding Extra Bold to keep the interface feeling "lite" and airy.
- **Captions:** Use the `caption` style for helper text and metadata, typically rendered in secondary neutral colors (`#64748B`).

## Layout & Spacing

The system employs a **Hybrid Grid Strategy**:
- **Referrer Experience (Mobile):** A fluid 1-column layout focused on vertical rhythm. Large touch targets (minimum 44px) are prioritized, with a fixed bottom navigation bar for one-handed operation.
- **Admin Experience (Desktop):** A fixed 12-column grid within a 1280px container. It utilizes a persistent left sidebar for navigation and high-density data tables to maximize information display.

**Spacing Rhythm:**
A strict 4px/8px base unit is used for all padding and margins. 
- **Cards:** 16px internal padding.
- **Sections:** 32px vertical separation.
- **Forms:** 20px gap between field groups.

## Elevation & Depth

Visual hierarchy is established using **Tonal Layers** supplemented by **Subtle Ambient Shadows**. The goal is to create a clear distinction between the "floor" (background) and "interactable objects" (cards/buttons).

- **Surface 0 (Background):** Neutral Slate/Zinc (`#F8FAFC`). No shadow.
- **Surface 1 (Cards):** Pure White (`#FFFFFF`) with a 1px hairline border (`#E2E8F0`) and a soft, low-opacity shadow (4px blur, 2% opacity black) to suggest a slight lift.
- **Surface 2 (Modals/Popovers):** Higher elevation with a more pronounced shadow (12px blur, 8% opacity) to focus the user's attention.

In Dark Mode, elevation is communicated through color lightness rather than shadows: higher surfaces use lighter shades of Navy/Slate to indicate they are closer to the user.

## Shapes

The shape language is **Rounded**, reflecting a modern and friendly fintech vibe. 
- **Cards & Large Containers:** Use `rounded-xl` (12px) to soften the layout and make the app feel approachable.
- **Buttons & Inputs:** Use `rounded-lg` (8px) for a more precise, functional appearance.
- **Badges:** Use "Pill" shapes (999px) to clearly distinguish status indicators from clickable buttons.

The **Logo** is a specific brand asset: a white "m" monogram enclosed in a royal-blue square with a 12px corner radius.

## Components

**Buttons:**
- **Primary:** Royal Blue background, white text. `rounded-lg` (8px). 12px vertical padding.
- **Secondary:** White background, Royal Blue border (1px), Royal Blue text.
- **Ghost:** No background or border, Deep Navy text. Used for "Cancel" or "Resend" actions.

**Status Badges (Pills):**
- Small, uppercase text, bold weight.
- Background: Light tint (10% opacity) of the status color.
- Text: Full saturation of the status color.
- Example: *Successful* = Emerald background (10%) + Emerald text.

**Stat Cards:**
- Large Geist Semibold number.
- Muted label below.
- Top-right icon placement using subtle 20px line icons (Lucide).

**Input Fields:**
- 1px neutral border that turns Royal Blue on focus.
- Labels sit 4px above the input in `body-md` weight.
- Error states use Red (`#EF4444`) for borders and helper text.

**Data Tables:**
- Desktop: Zebra-free, 1px bottom border on rows.
- High horizontal padding (24px) for the first and last columns.
- Sticky headers for long audit logs.