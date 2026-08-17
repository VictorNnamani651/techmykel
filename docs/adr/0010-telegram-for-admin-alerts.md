# Admin alerts go out over Telegram, not WhatsApp

Admin notifications existed only as rows in the `notifications` table, so the
owner had to be looking at the dashboard to know a referral or redemption had
arrived. We added an out-of-app channel and chose **Telegram**, behind a
pluggable sender (`lib/alerts/`) shaped like `lib/sms/` from ADR-0001.

## Why not WhatsApp

WhatsApp is the obvious choice in Nigeria and is what was originally asked for,
so the rejection needs recording or it will be re-proposed every few months.

- **It buys nothing for a single known recipient.** The WhatsApp Business
  Platform exists to message *customers at scale*. Business-initiated messages
  require a Meta Business account, business verification with company documents,
  and message templates approved in advance — you cannot send arbitrary text.
  That entire apparatus, to message the owner.
- **It would consume the shop's public number.** A number registered with the
  Cloud API can no longer be used in the normal WhatsApp app. `+2348142778625`
  is the WhatsApp and call CTA in the hero, `RepairCTA` and the footer of the
  marketing site (ADR-0009). Using it for the API kills the primary conversion
  path; avoiding that means buying and maintaining a second line.
- **Templates fight the message content.** Alerts interpolate customer names and
  phone numbers. Every wording change needs re-approval.

Telegram costs nothing, needs no verification or templates, sends arbitrary
text, and delivers instantly. The admin is one person who installs one app.

**SMS via the existing Twilio sender** was the other candidate — zero new
infrastructure — but it bills per message and Nigeria's DND regime silently
blocks a lot of A2P SMS. Acceptable risk for the owner's known-good number,
unacceptable for the referrer-facing phase this seam is meant to grow into.

## Consequences

- **Alerts are per event; notification rows are per recipient.** `notifyAdmins()`
  writes one `notifications` row per admin (each keeps its own read state) but
  dispatches exactly **one** alert. `TELEGRAM_CHAT_ID` is a single owner inbox,
  so dispatching per admin row delivers duplicates the moment a second admin
  exists — which it now does. A maintainer must not "simplify" the alert back
  into the per-admin loop.
- **`ALERT_PROVIDER` is a silent failure mode.** Unset, `getAlertSender()` falls
  back to the console sender: no error, no alert, nothing in Telegram. It must be
  set in every deployed environment or the feature looks simply broken.
- **A bot cannot open a conversation.** The admin must message it first; the chat
  ID is then read out with `scripts/telegram-chat-id.mjs`. This is a manual
  bootstrap step that has to be repeated if the bot or admin account changes.
- **Signup alerts fire on OTP verification, not `register()`.** An account is
  only real once verified, and `register()` re-runs for unverified phones via the
  resume path — alerting there would ping on abandoned signups and repeat.
- **Multi-admin needs per-user chat IDs.** Staff accounts are deferred
  (`docs/ROADMAP.md`); when they arrive, one shared inbox stops being correct.
- **Delivery never blocks the action.** A failed send is caught and logged. The
  in-app notification is already written and stays the durable record.
- `scripts/purge-test-user.mjs` deletes `audit_log` rows, contradicting ADR-0003.
  It is a deliberate, guarded exception for throwaway test accounts (dry-run by
  default, refuses admin accounts). The real fix — a separate test database — is
  deferred; if this gets used routinely, do that instead.

## Considered and rejected

- **WhatsApp Business Platform** — see above. Revisit only for the *referrer*
  facing phase, where reaching people who will never install Telegram is the
  whole point and the template cost buys real reach.
- **SMS through the existing Twilio sender** — per-message cost and NG DND
  blocking, for no gain over Telegram on a single known recipient.
- **Email** — free, but not something a shop owner notices while working.
- **Web push** — free, but needs service-worker and subscription plumbing for one
  user, and is unreliable on mobile once the browser is closed.
