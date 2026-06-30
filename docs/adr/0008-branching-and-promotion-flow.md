# Branching model: development → staging → main, PR-promoted

The repo had grown disorganised — a stale `master` stub (just the Create-Next-App
initial commit), the real work on `feat/v1-build` (the Vercel production branch),
and a redundant `feature` branch already merged via PR #5. We decided to adopt a
**three-tier branching model** with a strict upward promotion flow, so there is a
clear, documented path from a developer's machine to production.

## The model

- **`main`** — production. The branch Vercel deploys to production. Protected:
  changes only via PR. Created by renaming `feat/v1-build` (preserving history and
  the Vercel deploy linkage) rather than starting a fresh branch.
- **`staging`** — the release-candidate / pre-production gate. **Not** a permanent
  mirror of `main`: it is cut from `main` at init and *returns* to matching `main`
  after every release, but between releases it sits ahead of `main` holding code
  awaiting final sign-off. It is what *decides* what reaches production. Protected:
  PR-only.
- **`development`** — integration branch and **GitHub default branch**. Where all
  current local code lands and where feature branches are cut from and merged back
  into. Left unprotected for solo velocity.
- **`feat/* · fix/* · chore/* · refactor/* · docs/*`** — short-lived branches cut
  from `development`. Created on demand: if a branch for the work doesn't exist,
  create it. Prefix follows Conventional-Commit semantics (`feat` = new behaviour,
  `fix` = bug fix, `refactor` = reshape app code with same behaviour, `chore` =
  deps/config/tooling/cleanup, `docs` = docs only).

Code flows strictly upward, one PR per hop:
`feat/* → development → staging → main`.

## Why

- **Nothing was actually in production-as-released yet**, so `main` starts from the
  real current code (`feat/v1-build`'s tip, which already contains the `feature`
  work), not the `master` stub. All three long-lived branches start identical.
- **`development` as default branch** makes feature PRs auto-target integration, so
  it's hard to accidentally merge straight into production. Vercel's *Production
  Branch* is pinned independently to `main`, so default-branch choice never affects
  what deploys to production.
- **PR-based promotion** turns every hop into a Vercel **Preview** deployment — the
  preview URL *is* the test point. "Passes out" today means: `eslint` clean,
  `next build` / Preview build succeeds, and the preview is manually verified.
  There is no automated test suite yet, so the gate is honestly manual.

## Hotfixes

Genuine production emergencies bypass the upward flow: cut `hotfix/*` **off
`main`**, PR into `main`, then **back-merge `main` down into `staging` and
`development`**. The back-merge is mandatory — without it the next normal
`staging → main` release re-introduces the bug.

## Consequences

- `master`, `feature`, and the `feat/v1-build` name are retired. After the rename,
  the Vercel *Production Branch* setting **must** be updated from `feat/v1-build` to
  `main` or production deploys break.
- Merge commits (not squash) are used for `development → staging → main` promotions
  so the three branches stay history-compatible and `staging` cleanly returns to
  matching `main` after a release.

## Considered and rejected

- **`main` as default branch** (better public first impression on this Public repo)
  — rejected because every feature PR would then default its base to production,
  making mis-merges easier for a solo operator.
- **Naming the production branch `production`** (literally self-describing) —
  rejected for `main`, which tooling, GitHub, and Vercel assume by convention; the
  production role is documented here instead of carried by the branch name.
- **A GitHub Actions `lint`+`build` gate** to partly automate "passes out" —
  deferred, not rejected. Worth adding later as `chore/add-ci`.
