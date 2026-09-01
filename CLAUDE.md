# Skedo — working notes for coding agents

Paid one-hour live workshops (India). Read `README.md` for what it is and
`prisma/schema.prisma` for the data model — the header comment there states the
six design rules that must not drift.

## Non-negotiables

- **Money is integer paise.** All arithmetic goes through `src/lib/money.ts`.
  Never introduce a float rupee value, in the DB or in code.
- **Product rules live in `src/lib/rules.ts`** as named constants. Never inline a
  policy number (20 seats, 42 minutes, 24 hours) at a call site.
- **Seat claiming must stay atomic.** Seats are pre-created per session; claim
  with a single conditional `UPDATE ... WHERE status = 'AVAILABLE'`. Never
  read-then-write, never count-then-insert.
- **The payment webhook is the only source of truth** for confirming a seat. The
  browser redirect confirms nothing. Every webhook is recorded in `WebhookEvent`
  first; the unique `(provider, eventId)` key makes duplicate delivery a no-op.
- **Notifications are idempotent** via the unique
  `(seatId, kind, channel)` key on `NotificationLog`. A retried job must never
  double-message a learner.
- **Tutors never see learner email addresses.** Names and counts only. This is
  a revenue-leakage decision, not a privacy nicety.
- **Certificates** need measured attendance and are titled "Certificate of
  Participation". Never imply accreditation.
- **Never claim live screen recording can be blocked.** Watermark only.

## Phase discipline

Phase 1 has one tutor and no commission splitting. Do not build tutor KYC,
payout dashboards, GST invoicing, recordings-as-products, bundles, DRM, or the
white-label portal. The schema already has the hooks (`Organization`,
`Product.kind`, seat-without-order, per-product commission) — leave them unused.

## Conventions

- TypeScript throughout, App Router, server components by default.
- Tailwind for styling. Mobile-first; every screen must work at 360px portrait,
  phone landscape, iPad both orientations, and desktop. Use `dvh`, not `vh`.
- Validate all input with Zod at the boundary.
- Times are stored UTC, displayed in `Asia/Kolkata`.
- Run `npm run typecheck` before considering work done.
