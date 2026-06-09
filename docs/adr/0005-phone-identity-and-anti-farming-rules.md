# Phone-number identity and anti-farming rules

Phone numbers are both the referrer's login identity and the referred customer's matching/uniqueness key, so we fix one canonical form and an asymmetric set of cross-role rules to prevent reward farming. All phones are normalized to E.164 `+234…` (Nigeria-only in V1) and validated as real NG mobile numbers before storage or comparison.

Rules:
- **Referred once, ever** — a phone can appear as a referred customer at most once across all referrals (unique index on `referredPhone`), regardless of outcome.
- **Referrers cannot be referred** — a referral's referred phone must not equal *any* existing referrer account phone (this subsumes the self-referral block). A registered referrer already knows the business; allowing them to be referred is pure farming.
- **Referred customers may become referrers** — registering a referrer whose phone matches a prior referred phone is allowed, but the account is flagged as a Converted Referrer and linked to the originating referral, for admin analytics.

The asymmetry is deliberate: past-referrer → cannot be referred (blocked); past-referred-customer → may become a referrer (allowed + tracked). A maintainer must not "simplify" this into a symmetric single-namespace rule, which would both break legitimate customer-to-referrer conversion and re-open the farming hole.
