// Referrer-facing plain-language guidance and toast copy.
//
// Per ADR decision (option 2): canonical statuses stay on badges and the
// timeline; the warm, explanatory wording lives only here, in the guidance
// banners and toasts. This is the single place to edit that copy.

export type GuidanceVariant = "info" | "success" | "error";

type Guidance = { variant: GuidanceVariant; text: string };

// Banner shown on the referral detail page, keyed by canonical referral status.
export const REFERRAL_GUIDANCE: Record<string, Guidance> = {
  unverified: {
    variant: "info",
    text: "Sent to Techmykel. We'll confirm you referred this customer, then set your reward.",
  },
  pending: {
    variant: "info",
    text: "Confirmed! The repair is underway. Your reward is set — you can redeem once it's marked done.",
  },
  successful: {
    variant: "success",
    text: "Your reward is ready. Choose how you'd like it — cash, airtime, or data.",
  },
  failed: {
    variant: "error",
    text: "This repair didn't go through, so there's no reward this time.",
  },
  rejected: {
    variant: "error",
    text: "We couldn't confirm this referral, so it didn't qualify for a reward.",
  },
};

// Guidance for a redemption, keyed by canonical redemption status.
export const REDEMPTION_GUIDANCE: Record<string, Guidance> = {
  requested: {
    variant: "info",
    text: "Request received — Techmykel will send your reward shortly.",
  },
  fulfilled: {
    variant: "success",
    text: "Your reward has been paid out. 🎉",
  },
  declined: {
    variant: "error",
    text: "We couldn't send it that way — you can request again.",
  },
  cancelled: {
    variant: "info",
    text: "You cancelled this request — you can redeem again anytime.",
  },
};

// Transient toast shown after an action, keyed by the ?toast= query param.
export const TOAST_MESSAGES: Record<string, Guidance> = {
  referral_created: {
    variant: "success",
    text: "Referral sent to Techmykel — we'll review it shortly.",
  },
  redemption_requested: {
    variant: "success",
    text: "Reward request sent — we'll be in touch.",
  },
  redemption_cancelled: {
    variant: "info",
    text: "Request cancelled. You can redeem again anytime.",
  },
  code_sent: {
    variant: "success",
    text: "Verification code sent to your phone.",
  },
};
