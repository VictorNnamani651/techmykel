# Phone + password as primary auth; OTP delivery pluggable

The platform is "phone-based," but SMS to Nigerian numbers via a US Twilio long-code is unreliable (geographic permissions, carrier filtering, sender-ID rules) and the available Twilio account credentials cannot currently be verified in the dashboard. We therefore make **phone number + hashed password** the primary, load-bearing login for both Referrers and the single Admin, so a flaky SMS path can never lock users out. Password reset is admin-assisted in V1 (no email channel).

SMS OTP is built behind a pluggable `SmsSender` interface (console sender for dev, Twilio sender for prod) so it can be tested and switched on without rework, but it is **not** required to authenticate in V1. OTP becomes primary later, alongside the planned WhatsApp integration.

One exception: OTP **is** load-bearing at **registration**, where a code is sent to prove the referrer owns the phone before the account is created (a one-time check per referrer, not per login). Day-to-day login remains password-only. So a Twilio outage blocks new sign-ups but never locks out existing users.

Note (2026-06-09): a live Twilio smoke test was run and **delivered** to a Nigerian Airtel number (alphanumeric sender ID "hcloud", one-way). So SMS works today — password remains primary not because SMS is broken, but to guarantee no user can ever be locked out by an SMS hiccup, and because long-term delivery reliability and account funding/limits are still unverified (dashboard access pending).
