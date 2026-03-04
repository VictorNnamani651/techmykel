# Project Execution Plan: Referral Reward Management Platform

## 1. System Overview

This is a mobile-first, web-based referral reward management platform for a small business. The system replaces manual tracking with a structured digital process.

- **Admin (Business Owner):** Creates referrals, confirms successful jobs, sets reward rules, and fulfills redemptions manually.
- **Referrer (User):** Logs in via phone number, views their successful/pending referrals, and requests to redeem rewards.
- **Rule:** One reward per successful referral. No wallet accumulation. Fixed, versioned rewards.

## 2. Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Neon Postgres
- **ORM:** Prisma
- **Authentication:** NextAuth.js (Auth.js) - Custom Phone Number Provider

## 3. Database Schema (Prisma)

The database must enforce strict relational boundaries with comprehensive audit timestamps (`createdAt`, `updatedAt`).

- **User:** `id` (UUID), `phoneNumber` (String, unique), `role` (Enum: ADMIN, REFERRER).
- **RewardConfig:** `id` (UUID), `title` (String), `rewardType` (Enum: CASH, AIRTIME, DATA), `value` (Int), `isActive` (Boolean). Acts as a versioned snapshot.
- **Referral:** `id` (UUID), `referrerId` (Relation to User), `customerName` (String), `customerPhone` (String, optional), `rewardConfigId` (Relation to RewardConfig), `status` (Enum: PENDING, SUCCESSFUL, FAILED).
- **Redemption:** `id` (UUID), `referralId` (Relation to Referral, unique 1-to-1), `status` (Enum: REQUESTED, FULFILLED).

## 4. Execution Phases

### Phase 1: Foundation & Data Layer

1. Initialize Prisma (`npm i -D prisma`, `npm i @prisma/client`).
2. Define the `schema.prisma` file using the exact models listed above.
3. Push the schema to the Neon Postgres database.
4. Generate the Prisma client.

### Phase 2: Authentication & Route Security

1. Configure NextAuth.js.
2. Implement a custom credentials provider to handle phone-number-based login for Referrers.
3. Implement Next.js Middleware to protect routes:
   - `/admin/*` is strictly for the `ADMIN` role.
   - `/dashboard/*` is strictly for the `REFERRER` role.

### Phase 3: Admin Core & Reward Configuration

1. Build the Admin Dashboard UI (Tailwind, mobile-responsive).
2. Create the "Reward Settings" interface to add new `RewardConfig` entries (must create new rows, not update old ones, to preserve historical data).
3. Build the "Referral Creation Form" for the admin to log a customer visit and link it to a registered referrer, generating a `PENDING` referral.
4. Build the workflow/UI for the admin to update a referral status from `PENDING` to `SUCCESSFUL` or `FAILED`.

### Phase 4: Referrer Experience (Mobile-First)

1. Build the Referrer Dashboard showing aggregated stats: Total Successful Referrals, Pending Referrals, and Available Rewards.
2. Create the "Redemption Flow" interface where a referrer clicks a `SUCCESSFUL` referral, chooses their reward type, and submits the request.

### Phase 5: Fulfillment & Audit Tracking

1. Build the "Redemption Queue" view for the admin, listing all `REQUESTED` redemptions.
2. Implement the server action and UI for the admin to mark a request as `FULFILLED` after they manually disburse the cash/airtime/data.
3. Verify all status changes properly trigger `updatedAt` timestamps for the audit trail.
