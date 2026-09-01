import Link from 'next/link'
import { tutorStats, workshops } from '@/lib/mock'
import {
  Badge,
  ButtonLink,
  Callout,
  Card,
  Eyebrow,
  PageHeader,
  SeatMeter,
  StatTile,
} from '@/components/ui'
import { formatRelative, formatSessionSlot } from '@/lib/format'
import { calculateEarnings, formatINR } from '@/lib/money'
import { PAYOUT, TUTOR_TIER } from '@/lib/rules'

// Screen 14 — Tutor dashboard.
export default function TutorDashboard() {
  const mine = workshops.filter((w) => w.tutor.handle === 'sathish')
  const upcoming = mine.filter((w) => w.status === 'PUBLISHED' || w.status === 'DEFERRED')
  const needsAttention = mine.filter((w) => w.status === 'DEFERRED')

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        eyebrow="Dashboard"
        title="Your workshops"
        lead={`Free tier: ${TUTOR_TIER.FREE.SESSIONS_PER_WEEK} session a week.`}
        actions={<ButtonLink href="/tutor/workshops/new">New workshop</ButtonLink>}
      />

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Upcoming" value={String(tutorStats.upcomingSessions)} />
        <StatTile label="Seats this month" value={String(tutorStats.seatsSoldThisMonth)} />
        <StatTile
          label="Held for you"
          value={formatINR(tutorStats.heldPaise)}
          hint={`Released T+${PAYOUT.HOLD_DAYS_AFTER_SESSION} after each session`}
          tone="brand"
        />
        <StatTile label="Attendance" value={`${tutorStats.averageAttendance}%`} hint="Average" />
      </div>

      {needsAttention.length > 0 && (
        <div className="mt-6">
          <Callout tone="accent" title="One session needs seats">
            <strong>{needsAttention[0].title}</strong> has {needsAttention[0].seatsTaken} of the{' '}
            {needsAttention[0].minSeats} needed and has already been moved once. If it does not fill by
            the new date, every seat is refunded automatically.
          </Callout>
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-lg">Scheduled</h2>
        <ul className="mt-4 flex flex-col gap-4">
          {upcoming.map((workshop) => {
            const earnings = calculateEarnings({
              pricePaise: workshop.pricePaise,
              confirmedSeats: workshop.seatsTaken,
            })
            return (
              <Card as="li" key={workshop.slug} className="flex flex-col gap-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-ink-faint">
                      {formatSessionSlot(workshop.startsAt)} · {formatRelative(workshop.startsAt)}
                    </p>
                    <Link
                      href={`/tutor/workshops/${workshop.slug}/attendees`}
                      className="mt-1 block font-display text-lg hover:underline"
                    >
                      {workshop.title}
                    </Link>
                  </div>
                  {workshop.status === 'DEFERRED' ? (
                    <Badge tone="accent">Moved a week</Badge>
                  ) : (
                    <Badge tone="brand">Published</Badge>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                  <SeatMeter taken={workshop.seatsTaken} max={workshop.maxSeats} min={workshop.minSeats} />
                  <div className="sm:text-right">
                    <Eyebrow>You earn so far</Eyebrow>
                    <p className="font-display text-xl tabular">{formatINR(earnings.netPaise)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-line pt-3">
                  <ButtonLink href={`/tutor/workshops/${workshop.slug}/creative`} size="sm" variant="secondary">
                    Get the poster
                  </ButtonLink>
                  <ButtonLink href={`/tutor/workshops/${workshop.slug}/attendees`} size="sm" variant="secondary">
                    {workshop.seatsTaken} attendees
                  </ButtonLink>
                  <ButtonLink href={`/tutor/workshops/${workshop.slug}/greenroom`} size="sm" variant="ghost">
                    Green room
                  </ButtonLink>
                </div>
              </Card>
            )
          })}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg">Finished</h2>
        <ul className="mt-4 flex flex-col gap-2">
          {mine
            .filter((w) => w.status === 'COMPLETED')
            .map((workshop) => (
              <Card as="li" key={workshop.slug} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-sm font-medium">{workshop.title}</p>
                  <p className="text-xs text-ink-faint">
                    {formatSessionSlot(workshop.startsAt)} · {workshop.seatsTaken} attended
                  </p>
                </div>
                <ButtonLink href={`/tutor/workshops/${workshop.slug}/report`} size="sm" variant="secondary">
                  Session report
                </ButtonLink>
              </Card>
            ))}
        </ul>
      </section>
    </div>
  )
}
