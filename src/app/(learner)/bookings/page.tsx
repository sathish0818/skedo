import Link from 'next/link'
import { bookings } from '@/lib/mock'
import { Badge, ButtonLink, Button, Callout, Card, EmptyState, PageHeader } from '@/components/ui'
import { formatSessionSlot, formatRelative } from '@/lib/format'
import { CERTIFICATE, RECORDING } from '@/lib/rules'

// Screen 05 — My bookings. Upcoming, needs-a-decision, and past in one list.
export default function BookingsPage() {
  if (bookings.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <EmptyState title="No bookings yet" action={<ButtonLink href="/">Browse workshops</ButtonLink>}>
          Sessions you book will appear here with your join link, recording and certificate.
        </EmptyState>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader title="My bookings" lead="Your join links, recordings and certificates." />

      <ul className="mt-6 flex flex-col gap-4">
        {bookings.map((booking) => {
          const { workshop } = booking
          const past = booking.status === 'ATTENDED' || booking.status === 'MISSED'

          return (
            <Card as="li" key={booking.reference} className="flex flex-col gap-4 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-ink-faint">
                    {formatSessionSlot(workshop.startsAt)}
                    {!past && ` · ${formatRelative(workshop.startsAt)}`}
                  </p>
                  <Link href={`/w/${workshop.slug}`} className="mt-1 block font-display text-lg hover:underline">
                    {workshop.title}
                  </Link>
                  <p className="text-sm text-ink-soft">
                    with {workshop.tutor.name} · seat {booking.seatNumber} · {booking.reference}
                  </p>
                </div>
                <BookingBadge status={booking.status} />
              </div>

              {booking.status === 'AWAITING_CONFIRMATION' && (
                <Callout tone="accent" title="This session moved by a week">
                  Only {workshop.seatsTaken} of {workshop.minSeats} needed seats were booked, so it now
                  runs on {formatSessionSlot(workshop.startsAt)}. Confirm you can make the new date, or
                  take a full refund — either is fine.
                </Callout>
              )}

              <div className="flex flex-wrap gap-2">
                {booking.status === 'CONFIRMED' && (
                  <>
                    <ButtonLink href={`/join/${booking.joinToken}`}>Open join page</ButtonLink>
                    {!booking.attendanceConfirmed && (
                      <Button variant="secondary">I&rsquo;ll be there</Button>
                    )}
                    <Button variant="ghost">Cancel for a refund</Button>
                  </>
                )}

                {booking.status === 'AWAITING_CONFIRMATION' && (
                  <>
                    <Button>Confirm the new date</Button>
                    <Button variant="danger">Refund me</Button>
                  </>
                )}

                {booking.status === 'ATTENDED' && (
                  <>
                    {booking.certificateCode && (
                      <ButtonLink href={`/verify/${booking.certificateCode}`}>
                        View certificate
                      </ButtonLink>
                    )}
                    {booking.recordingAvailable && (
                      <ButtonLink href={`/recordings/${workshop.slug}`} variant="secondary">
                        Watch recording
                      </ButtonLink>
                    )}
                    <ButtonLink href={`/chat/${workshop.slug}`} variant="ghost">
                      Workshop chat
                    </ButtonLink>
                  </>
                )}

                {booking.status === 'MISSED' && booking.recordingAvailable && (
                  <ButtonLink href={`/recordings/${workshop.slug}`} variant="secondary">
                    Watch recording
                  </ButtonLink>
                )}
              </div>

              {past && (
                <p className="border-t border-line pt-3 text-xs text-ink-faint">
                  {booking.status === 'ATTENDED'
                    ? `You were present for ${booking.minutesPresent} minutes — above the ${CERTIFICATE.THRESHOLD_MINUTES} needed for a certificate.`
                    : `You did not attend, so no certificate was issued. The recording is yours for ${RECORDING.ACCESS_DAYS} days.`}
                </p>
              )}
            </Card>
          )
        })}
      </ul>
    </div>
  )
}

function BookingBadge({ status }: { status: (typeof bookings)[number]['status'] }) {
  switch (status) {
    case 'CONFIRMED':
      return <Badge tone="brand">Confirmed</Badge>
    case 'AWAITING_CONFIRMATION':
      return <Badge tone="accent">Needs your decision</Badge>
    case 'ATTENDED':
      return <Badge tone="brand">Attended</Badge>
    case 'MISSED':
      return <Badge tone="neutral">Missed</Badge>
    case 'REFUNDED':
      return <Badge tone="neutral">Refunded</Badge>
  }
}
