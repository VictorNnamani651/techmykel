# Stack: Drizzle, custom DB-backed sessions, scrypt — no Prisma, no NextAuth

Targeting Next.js 16 (App Router) + React 19 + Tailwind v4 on Vercel, with Neon Postgres.

- **Drizzle ORM** for data access (not Prisma): SQL-first, fully typed, tiny, works with Neon's serverless driver, first-class migrations. Prisma's query engine is heavier than this schema warrants; raw SQL loses type safety.
- **Custom DB-backed sessions** (not NextAuth/Auth.js): a `sessions` table keyed by an opaque id stored in an httpOnly, secure cookie; the row holds user id, role, and expiry. Chosen because the auth flow is bespoke (phone + password for login, OTP only at registration, single-admin role) and a third-party auth library's abstractions fight that flow more than they help — especially on a Next 16 we don't have prior experience with. DB sessions also give us revocation and fit the audit story.
- **scrypt** (Node built-in `crypto`) for password and OTP-code hashing: zero dependencies, no native binaries to break on Vercel serverless, vetted KDF. Avoids bcrypt/argon2 native-module issues.

Trade-off: we own more auth code than a library would give us, but the flow is small, fully understood, and free of version-compatibility risk against the unfamiliar Next 16 runtime. Next 16 has breaking changes (e.g. middleware reworked as "proxy", async `cookies()`); the relevant `node_modules/next/dist/docs/` guides are to be read before writing routing/auth/data-mutation code.
