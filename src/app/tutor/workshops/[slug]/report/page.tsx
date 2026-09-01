import { notFound } from 'next/navigation'
import { attendees, getWorkshop, questions } from '@/lib/mock'
import {
  Badge,
  Button,
  Callout,
  Card,
  Eyebrow,
  PageHeader,
  ScrollX,
  StatTile,
} from '@/components/ui'
import { formatSessionSlot } from '@/lib/format'
import { calculateEarnings, formatINR } from '@/lib/money'
import { CERTIFICATE, PAYOUT } from '@/lib/rules'

// Screen 21 — Session report. What happened, who gets a certificate, what you earned.
export default async function ReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const workshop = getWorkshop(slug) ?? notFound()

  const booked = attendees.slice(0, workshop.seatsTaken)
  const turnedUp = booked.filter((a) => a.minutesPresent > 0)
  const certified = booked.filter((a) => a.minutesPresent >= CERTIFICATE.THRESHOLD_MINUTES)
  const attendanceRate = Math.round((turnedUp.length / booked.length) * 100)
  const unanswered = questions.filter((q) => !q.answered)
  const earnings = calculateEarnings({
    pricePaise: workshop.pricePaise,
    confirmedSeats: booked.length,
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        eyebrow={`Completed · ${formatSessionSlot(workshop.startsAt)}`}
        title={workshop.title}
        lead={`${turnedUp.length} of ${booked.length} booked learners turned up.`}
        actions={<Button variant="secondary">Download attendance CSV</Button>}
      />

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Attendance" value={`${attendanceRate}%`} tone="brand" hint={`${turnedUp.length}/${booked.length} joined`} />
        <StatTile label="Certificates" value={String(certified.length)} hint={`≥ ${CERTIFICATE.THRESHOLD_MINUTES} min present`} />
        <StatTile label="Questions" value={String(questions.length)} hint={`${unanswered.length} still open`} />
        <StatTile label="You earned" value={formatINR(earnings.netPaise)} tone="brand" />
      </div>

      {unanswered.length > 0 && (
        <div className="mt-6">
          <Callout tone="accent" title={`${unanswered.length} questions never got answered`}>
            Answering these in writing is the cheapest goodwill available to you — learners rate it
            higher than almost anything else, and it takes ten minutes.
            <ul className="mt-2 flex flex-col gap-1">
              {unanswered.map((q) => (
                <li key={q.id} className="text-ink">
                  “{q.body}” <span className="text-ink-faint">— {q.upvotes} upvotes</span>
                </li>
              ))}
            </ul>
            <Button size="sm" className="mt-3">
              Answer in the workshop chat
            </Button>
          </Callout>
        </div>
      )}

      <section className="mt-8">
        <Eyebrow>Attendance detail</Eyebrow>
        <ScrollX>
          <Card className="mt-3 min-w-[36rem] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-faint">
                  <th className="px-4 py-2.5 font-medium">Seat</th>
                  <th className="px-4 py-2.5 font-medium">Name</th>
                  <th className="px-4 py-2.5 font-medium">Minutes present</th>
                  <th className="px-4 py-2.5 font-medium">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {booked.map((attendee) => {
                  const earned = attendee.minutesPresent >= CERTIFICATE.THRESHOLD_MINUTES
                  return (
                    <tr key={attendee.seatNumber}>
                      <td className="px-4 py-2.5 font-mono text-xs tabular text-ink-faint">
                        {String(attendee.seatNumber).padStart(2, '0')}
                      </td>
                      <td className="px-4 py-2.5">{attendee.name}</td>
                      <td className="px-4 py-2.5 tabular">{attendee.minutesPresent}</td>
                      <td className="px-4 py-2.5">
                        {earned ? <Badge tone="brand">Issued</Badge> : <Badge tone="neutral">No</Badge>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
        </ScrollX>
        <p className="mt-2 text-xs text-ink-faint">
          Minutes are measured from join and leave events, not self-reported.
        </p>
      </section>

      <section className="mt-8">
        <Eyebrow>Payout</Eyebrow>
        <Card className="mt-3 p-5">
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">
                {booked.length} seats × {formatINR(workshop.pricePaise)}
              </dt>
              <dd className="tabular">{formatINR(earnings.grossPaise)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">
                Skedo commission {earnings.commissionCapped ? `(capped at ${earnings.effectiveRatePercent}%)` : '(20%)'}
              </dt>
              <dd className="tabular">− {formatINR(earnings.commissionPaise)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">TDS 194-O (1%)</dt>
              <dd className="tabular">− {formatINR(earnings.tdsPaise)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2 font-medium">
              <dt>Yours</dt>
              <dd className="tabular">{formatINR(earnings.netPaise)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4">
            <Badge tone="brand">Released</Badge>
            <p className="text-sm text-ink-soft">
              Paid {PAYOUT.HOLD_DAYS_AFTER_SESSION} days after the session, once the attendance log was
              final.
            </p>
          </div>
        </Card>
      </section>
    </div>
  )
}
