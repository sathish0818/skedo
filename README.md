# Skedo

Paid one-hour live workshops, sold and certified end to end.

A tutor publishes a workshop. A learner pays by UPI and gets a seat. Reminders
go out on their own. Everyone joins a live room with a link that can't be
shared. Attendance is measured, certificates are issued to the people who
actually turned up, and the recording reaches everyone who paid.

Nothing in that chain needs a human.

## Status

**Phase 1 — solo pilot.** One tutor (the founder), real learners, money straight
to the founder's own account. Tutor KYC, commission splitting and payout
dashboards are deliberately not built yet; the database already carries every
hook they need.

## Running it

```bash
npm install
cp .env.example .env   # then fill in DATABASE_URL
npm run db:migrate     # first run creates the tables
npm run dev
```

Open http://localhost:3000.

Only `DATABASE_URL` is needed to start. A free Postgres is a two-minute signup
at [neon.tech](https://neon.tech). Everything else in `.env` is filled in as
each feature lands, and Razorpay runs in test mode until the first real pilot.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run db:migrate` | Create or update tables from the schema |
| `npm run db:studio` | Browse and edit the database in a GUI |
| `npm run typecheck` | Check types without building |
| `npm run lint` | Lint |

## Stack

TypeScript · Next.js 16 (App Router) · React 19 · Tailwind 4 · Postgres +
Prisma 7 · deployed on Vercel.

Chosen partly because it is the most common stack in India right now, so this
codebase can be handed to any freelance developer later.

## How it's laid out

```
prisma/schema.prisma   The data model. Read this first — the rules live here.
prisma.config.ts       Prisma 7 keeps the DB URL out of the schema.
src/lib/db.ts          Prisma client singleton.
src/lib/money.ts       Every rupee calculation. Paise only, never floats.
src/lib/rules.ts       Every product rule as a named constant.
src/app/               Routes and pages.
```

## Screens

All 22 screens plus the 9 automated messages are built and clickable against
sample data in `src/lib/mock.ts` — no database needed to review them.

| Learner | Route |
| --- | --- |
| Browse | `/` |
| Workshop sales page | `/w/figma-to-production` |
| Checkout | `/w/figma-to-production/checkout` |
| Payment success | `/w/figma-to-production/success` |
| My bookings | `/bookings` |
| Waiting room | `/join/demo-upcoming` |
| Live room | `/join/demo-upcoming/live` |
| Post-session rating | `/join/demo-past/rate` |
| Certificate + public verify | `/verify/SKD-4K7P-92MX` |
| Recording player | `/recordings/figma-to-production` |
| Workshop chat | `/chat/figma-to-production` |

| Tutor | Route |
| --- | --- |
| Sign up | `/signup` |
| Profile | `/tutor/profile` |
| Dashboard | `/tutor` |
| Create workshop | `/tutor/workshops/new` |
| Publish preview | `/tutor/workshops/figma-to-production/preview` |
| Social creative | `/tutor/workshops/figma-to-production/creative` |
| Attendee list | `/tutor/workshops/figma-to-production/attendees` |
| Green room | `/tutor/workshops/figma-to-production/greenroom` |
| Live room, host view | `/tutor/workshops/figma-to-production/live` |
| Session report | `/tutor/workshops/figma-to-production/report` |
| Public tutor page | `/@sathish` |

All nine messages are previewed side by side at `/dev/messages`.

### Design foundation

Colour, type and spacing tokens are in `src/app/globals.css`. Deep forest green
brand, marigold for anything scarce or urgent — Indian edtech is uniformly blue
and purple, and green reads as trust rather than tech. Every colour is a token;
a hard-coded hex will not follow dark mode.

Reusable primitives are in `src/components/ui.tsx`. Nothing should hand-roll a
button, badge, card, form field or seat meter.

## Rules that must not drift

These are encoded in `src/lib/rules.ts` and `prisma/schema.prisma`. Changing
them is a policy decision, not a refactor.

- **Money is integer paise.** Never a float, never rupees, in the database or in
  any calculation.
- **Seats are pre-created and claimed atomically.** Twenty `Seat` rows exist
  before anyone buys; checkout claims one with a single
  `UPDATE ... WHERE status = 'AVAILABLE'`. That is what makes overselling the
  twentieth seat impossible rather than unlikely.
- **A seat does not require a payment.** That is what lets a college buy sixty
  seats on an invoice, and what lets the pilot confirm seats by hand.
- **The payment webhook is the only source of truth.** Never the browser
  redirect — the learner can close the tab, and the redirect can be forged.
- **Payout is held until two days after the session.** A tutor cancellation must
  cost the tutor, and that only works while the platform still holds the money.
- **One *active* connection per booking, not one join event.** A learner whose
  mobile network drops must be able to come straight back in; a second person
  with a copied link must not get in. A new connection displaces the old one.
- **Tutors never see learner email addresses.** Names and counts only.
- **Certificates require measured attendance** — 42 of 60 minutes — and say
  "Certificate of Participation", never anything implying accreditation.
- **Live screen recording cannot be prevented.** Watermark the learner's email
  on the stream and move on. DRM is a recordings-only option, later.

## Documentation

The full v1 specification — core loop, decision register, screens to design,
build order — is at
<https://claude.ai/code/artifact/97f9d302-3b51-4177-a0ad-e980490e74a1>.

## Open decisions

- Minimum seats to run: currently **5**
- Commission: currently **20%, capped at ₹2,500 per session**
