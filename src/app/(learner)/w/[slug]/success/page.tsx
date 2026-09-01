import { notFound } from 'next/navigation'
import { getWorkshop } from '@/lib/mock'
import { Badge, ButtonLink, Card, Eyebrow } from '@/components/ui'
import { formatDateLong, formatSessionSlot, joinOpensAt, formatTime } from '@/lib/format'
import { SESSION } from '@/lib/rules'

// Screen 04 — Payment success. Confirms, sets expectations, reduces no-shows.
export default async function SuccessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const workshop = getWorkshop(slug)
  if (!workshop) notFound()

  const steps = [
    { when: 'Now', what: 'A confirmation email with your personal join link and a calendar invite.' },
    { when: '24 hours before', what: 'A WhatsApp message asking you to confirm you are coming.' },
    { when: '1 hour before', what: 'A reminder, on WhatsApp and email.' },
    {
      when: `${SESSION.JOIN_OPENS_MINUTES_BEFORE} minutes before`,
      what: `Doors open at ${formatTime(joinOpensAt(workshop.startsAt))} — join early and check your audio.`,
    },
    { when: 'After the session', what: 'The recording, and your certificate if you attended.' },
  ]

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="flex flex-col items-center text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-brand-tint text-2xl text-brand">
          ✓
        </span>
        <h1 className="mt-5 text-2xl sm:text-3xl">Seat 7 is yours</h1>
        <p className="mt-2 max-w-[46ch] text-ink-soft">
          You are booked for <strong className="text-ink">{workshop.title}</strong> on{' '}
          {formatDateLong(workshop.startsAt)}.
        </p>
        <p className="mt-3 font-mono text-xs text-ink-faint">Reference SKD-8F2A41</p>
      </div>

      <Card className="mt-8 flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Eyebrow>When</Eyebrow>
            <p className="mt-1 font-display text-lg">{formatSessionSlot(workshop.startsAt)}</p>
          </div>
          <Badge tone="brand">Seat 7 of {workshop.maxSeats}</Badge>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <ButtonLink href="/bookings" full>
            Go to my bookings
          </ButtonLink>
          <ButtonLink href="#" variant="secondary" full>
            Add to calendar
          </ButtonLink>
        </div>
      </Card>

      <section className="mt-8">
        <h2 className="text-lg">What happens next</h2>
        <ol className="mt-3 divide-y divide-line border-y border-line">
          {steps.map((step) => (
            <li key={step.when} className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
              <span className="font-mono text-xs uppercase tracking-wide text-ink-faint">
                {step.when}
              </span>
              <span className="text-sm text-ink-soft">{step.what}</span>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-6 text-sm text-ink-faint">
        Your join link works on one device at a time. If your connection drops you can simply rejoin —
        but the link will not work for anyone else.
      </p>
    </div>
  )
}
