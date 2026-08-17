# Referral Reward Management

A controlled reward-lifecycle system for a small phone-repair business: existing customers refer new ones, and successful referrals earn a redeemable reward. This glossary defines the shared language of the domain.

## Actors

**Admin**:
The business owner. The single privileged actor who verifies referrals, confirms job and payment completion, sets reward rules, and fulfils redemptions.
_Avoid_: Owner, manager, staff

**Referrer**:
A registered user who refers new customers by word of mouth and creates referrals in the app. Earns rewards for successful referrals.
_Avoid_: Member, affiliate, user

**Converted Referrer**:
A Referrer whose account phone matches a phone that was previously a Referred Customer — i.e. a customer who was referred to the business and later joined the program. Flagged and linked back to the originating referral for admin analytics.
_Avoid_: Upgraded user, repeat user

**Referred Customer**:
A person, with no account, who is referred to the business and recorded against a Referrer. Identified within a Referral by name and phone number.
_Avoid_: Lead, client, account

## Core terms

**Refer & Earn**:
The public name of the referral programme — the marketing surface where a prospective Referrer learns about it and signs up. Deliberately a secondary offer: discoverable, never the business's leading message.
_Avoid_: Affiliate programme, partner programme, rewards scheme

**Referral**:
A claim by a Referrer that they sent a specific Referred Customer to the business. Created by the Referrer with the referred customer's name and phone number, then verified and progressed by the Admin. Carries a status through its lifecycle and, once successful, grants exactly one reward.
_Avoid_: Lead, introduction

**Matching Key**:
The referred customer's phone number, used by the Admin to locate the correct pending Referral when that customer walks in. Name is a secondary/fuzzy search aid.

**New Referral**:
A referral for a phone number that has never appeared in the system before. Only new referrals are valid — a phone number is referrable exactly once, ever, regardless of the prior referral's outcome. Repeat customers do not generate fresh referrals.
_Avoid_: Repeat referral, re-referral

## Referral status

**Unverified**:
A Referral the Referrer has just created; the Admin has not yet confirmed the referrer truly referred this customer. The entry state of every referral.
_Avoid_: Submitted, new, pending

**Pending**:
A Referral the Admin has verified as genuine; the repair job is underway but not yet completed or paid. Awaiting outcome.
_Avoid_: In progress, approved

**Successful**:
A Referral whose job was completed and paid in full. Grants exactly one redeemable reward.

**Failed**:
A Referral whose job was cancelled, not completed, or not paid in full. Grants no reward. Distinct from Rejected: the referral was genuine but the deal fell through.

**Rejected**:
A Referral the Admin deemed not genuine (fake, duplicate claim, or abuse). Grants no reward. Distinct from Failed: the claim itself was not honoured.

## Reward

**Reward Amount**:
A single whole-naira figure the Admin sets on a Referral at verification (when it moves to Pending), visible to the Referrer once set. Editable by the Admin while the referral is Pending; locked once it becomes Successful. Every change is recorded in the Audit Log. There is no global or versioned reward configuration — each referral carries its own amount.
_Avoid_: Reward config, reward rules, payout

**Reward Type**:
The delivery form the Referrer chooses for their Reward Amount: cash, airtime, or data. The three types are fixed and exhaustive. The type does not change the amount — data means "data worth the Reward Amount."
_Avoid_: Reward option, reward category

**Reward**:
The single entitlement granted by a Successful Referral: the Reward Amount, delivered in the Reward Type the Referrer selects at redemption. Exactly one per successful referral; never pooled.
_Avoid_: Payout, bonus, credit

## Redemption

**Redemption**:
A Referrer's request to receive the Reward for a Successful Referral, naming the chosen Reward Type. At most one per referral. The Admin fulfils it manually (pays cash / sends airtime / sends data) outside the system.
_Avoid_: Claim, withdrawal, cash-out

**Reward Destination**:
Where a Reward is actually sent, supplied by the Referrer when they redeem. For cash it is a bank name, account number and account name; for airtime and data it is a phone number, which need not be the Referrer's account phone. Held on the Referrer as reusable defaults and copied onto the Redemption as an unchangeable record of where that specific Reward went.
_Avoid_: Payout details, bank details, payment info

**Requested**:
A Redemption the Referrer has submitted; the type is locked and the Admin has been notified. Awaiting payout.

**Fulfilled**:
A Redemption the Admin has paid out and marked done. Terminal; the referral's reward is now consumed.

**Declined**:
A Redemption the Admin refused to fulfil (e.g. the chosen type can't be delivered), with a reason. Returns the referral to redeemable so the Referrer can redeem again.

**Cancelled**:
A Requested Redemption the Referrer withdrew before fulfilment (e.g. wrong type picked). Returns the referral to redeemable.

## Accountability

**Audit Log**:
The system-wide, append-only, immutable record of significant actions — every referral/redemption state transition, the Admin's amount-setting, and referral creation — each with actor and timestamp. Never edited or deleted. Visible only to the Admin.
_Avoid_: History table, event log, activity feed

**Status History**:
The timeline of a single Referral or Redemption, derived by filtering the Audit Log to that one entity. The Referrer sees only the history of their own referrals and redemptions; never the system-wide Audit Log.
_Avoid_: Timeline, trail
