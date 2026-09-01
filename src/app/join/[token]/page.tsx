import Link from 'next/link'
import { getBooking } from '@/lib/mock'
import { Badge, ButtonLink, Callout, Card, Eyebrow } from '@/components/ui'
import { Preflight } from '@/components/preflight'
import { Logo } from '@/components/shell'
import { formatRelative, formatSessionSlot, formatTime, joinOpensAt } from '@/lib/format'
import { SESSION } from '@/lib/rules'

// Screen 06 — Waiting room. The last chance to catch a setup problem.
export default async function WaitingRoomPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const booking = getBooking(token)
  const { workshop } = booking
  const doorsOpen = joinOpensAt(workshop.startsAt)
  const isOpen = Date.now() >= doorsOpen.getTime()

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex items-center justify-between">
        <Logo />
        <Badge tone="neutral">Seat {booking.seatNumber}</Badge>
      </div>

      <header className="mt-8 flex flex-col gap-2">
        <Eyebrow>{isOpen ? 'Doors are open' : `Starts ${formatRelative(workshop.startsAt)}`}</Eyebrow>
        <h1 className="text-2xl sm:text-3xl">{workshop.title}</h1>
        <p className="text-ink-soft">
          {formatSessionSlot(workshop.startsAt)} · with {workshop.tutor.name}
        </p>
      </header>

      <div className="mt-6 flex flex-col gap-4">
        {!isOpen && (
          <Callout tone="neutral" title={`Join from ${formatTime(doorsOpen)}`}>
            The room opens {SESSION.JOIN_OPENS_MINUTES_BEFORE} minutes early. Run the check below now so
            there are no surprises.
          </Callout>
        )}

        <Preflight />

        <Card className="p-5">
          <Eyebrow>Good to know</Eyebrow>
          <ul className="mt-3 flex flex-col gap-2.5 text-sm text-ink-soft">
            <li>
              <strong className="text-ink">Cameras stay off</strong> — yours and everyone else&rsquo;s.
              Only the tutor is on screen.
            </li>
            <li>
              <strong className="text-ink">{workshop.recommendedDevice}</strong>
            </li>
            <li>
              <strong className="text-ink">Questions in text</strong>, or tap to request an unmute in
              the last {SESSION.QA_MINUTES} minutes.
            </li>
            <li>
              <strong className="text-ink">If your internet drops, just rejoin.</strong> Your link works
              on one device at a time — coming back kicks the old connection, so a network blip costs you
              nothing.
            </li>
          </ul>
        </Card>

        <ButtonLink href={`/join/${token}/live`} size="lg" full variant={isOpen ? 'primary' : 'secondary'}>
          {isOpen ? 'Join the session' : 'Join early (demo)'}
        </ButtonLink>

        <Link href="/bookings" className="text-center text-sm text-ink-soft hover:text-ink">
          Back to my bookings
        </Link>
      </div>
    </div>
  )
}
