# Database reads retry on transient failures; writes never do

Neon scales the compute to zero after inactivity. Waking it takes ~3s, and the
`@neondatabase/serverless` HTTP driver can time out first — Drizzle then reports
a generic "Failed query" with the real cause swallowed. On a low-traffic shop app
the query that pays the wake-up cost is usually the **session lookup at the start
of a request**, so the first visitor after a quiet spell gets a crash page,
refreshes, and it works.

We wrap `neonConfig.fetchFunction` with a bounded retry: up to two extra
attempts, 150ms then 600ms, on a thrown fetch or a 5xx response.

## Reads only — this is the point

**A write is never retried.** If a write's response is lost, the statement may
already have been applied. Replaying it would duplicate `audit_log` and
`notifications` rows, which have no unique constraint to catch it — and a phantom
duplicate in an append-only log (ADR-0003) is worse than the error we are fixing.

Reads are idempotent, and the cold-start failure lands on a read anyway, so the
restriction costs nothing.

Read/write is decided by parsing the request body and requiring **every**
statement to begin with `select` or `with`. If the body cannot be parsed, or a
batch mixes reads and writes, it is treated as a write and not retried — the
safe default is always "don't replay".

**Do not "simplify" this to retry all queries.**

## Consequences

- 4xx responses are returned immediately. They are deterministic (bad SQL, bad
  credentials) and retrying only delays the real error.
- A genuinely dead database now takes ~750ms longer to report failure on reads.
  Acceptable against the crash pages it removes.
- The retry is invisible to callers: no call site changes, and every query goes
  through it because it wraps the transport rather than the query builder.
- It does not fix a cold start that exceeds all three attempts. If that shows up,
  the next step is keeping the compute warm or a paid Neon tier, not more retries.

## Considered and rejected

- **Retrying everything, including writes.** Simpler, and most writes here are
  protected by unique constraints — but `audit_log` and `notifications` are not,
  and silently duplicating audit entries undermines the record that settles
  payout disputes.
- **A scheduled ping to keep the compute warm.** Effective, but it burns compute
  hours around the clock to avoid a problem the retry mostly solves, and it
  defeats the scale-to-zero the plan is paying for.
- **A paid Neon tier with auto-suspend disabled.** Real money for a problem worth
  about thirty lines of code. Revisit if traffic grows enough that cold starts
  stop being the issue and connection limits start being one.
- **Retrying inside a Drizzle wrapper rather than at the transport.** Drizzle's
  builders are thenables, not promises, so retrying there means intercepting
  every query shape. `fetchFunction` is one seam that covers all of them.
