# Reward Destination is stored twice: defaults on the Referrer, a snapshot on the Redemption

Referrers need to tell the Admin where a Reward should go — bank name, account
number and account name for cash, or a phone number for airtime and data, which
need not be the number they signed up with. The same four fields therefore exist
on **both** `users` (editable defaults) and `redemptions` (an unchangeable
snapshot written when the Redemption is requested).

## Why not one place

This looks like redundant duplication and will invite normalisation. It is not.

- **Defaults only, on `users`.** When a Referrer changes bank six months later,
  every past Redemption silently starts pointing at the new account. The
  question "which account did I actually send that ₦4,000 to?" becomes
  unanswerable — in the one part of the system where being wrong costs real
  money and the Referrer is disputing it. That contradicts the accountability
  ADR-0003 exists to provide.
- **Snapshot only, on `redemptions`.** The Referrer retypes a ten-digit account
  number on a phone keyboard for every reward. Errors would be frequent, and a
  mistyped digit sends the Admin's money to a stranger, irreversibly.

Both gives one-time entry plus a permanent record of where each payment went.

**Do not "simplify" the snapshot away.** Deleting those columns destroys the
only evidence of where money was actually sent.

## Consequences

- **Bank defaults are saved back to `users` after a Redemption; the phone is
  not.** Sending airtime to someone else's number is a deliberate one-off. If it
  became the saved default, the next Redemption would silently pre-fill a
  friend's number — a quiet way to misdirect money. The phone field defaults to
  the Referrer's registered number every time.
- **Stored in plaintext, like phone numbers.** Hashing is impossible (the value
  must be read back to pay), so the only option is reversible encryption, whose
  key would live beside `DATABASE_URL` and leak with it. A Nigerian account
  number is a receive-only identifier — people publish theirs to get paid, and
  nobody can withdraw knowing one. Protection comes from access control:
  admin-only, and a Referrer sees only their own.
- **Full details go in the Telegram alert** (ADR-0010), accepting that Telegram
  cloud chats are not end-to-end encrypted. The point of the alert is acting
  without opening the dashboard, and the data is receive-only.
- **Which fields are required is enforced in `redeemSchema`**, as a discriminated
  union on `rewardType`, not a DB `CHECK`. The rule needs per-field error
  messages the form can display. A single application writes this table, so the
  weaker guarantee is acceptable.
- Columns are explicit, not `jsonb`. There are two known shapes; `jsonb` appears
  exactly once in this schema, for the audit log, because that is the one payload
  whose shape genuinely is not known in advance.

## Considered and rejected

- **A bank-account resolution API** (Paystack/Flutterwave) to verify the account
  name against the number. Rejected because fulfilment is manual: the Admin types
  the number into their own banking app, which shows the real account holder's
  name before they confirm. That check is authoritative, free, and happens at
  exactly the right moment. The Referrer's typed account name is still collected
  so the Admin has something to compare it against.
- **Free-text bank name.** "GTB", "GT Bank" and "Guaranty Trust Bank" are one
  bank written three ways, and the Admin is the one who has to interpret them at
  a cash machine. A picklist removes the ambiguity permanently.
- **Collecting the mobile network** for airtime and data. Number portability
  makes the prefix unreliable *and* the field redundant — the Admin's top-up app
  resolves the network from the number itself.
- **A separate profile screen** as the only place to enter details. It adds a
  drop-off point between deciding to collect a reward and collecting it. The
  fields live in the redeem flow, where they are actually needed; a profile
  screen can be added later without changing that flow.
