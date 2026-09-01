import { notFound } from 'next/navigation'
import { attendees, getWorkshop } from '@/lib/mock'
import {
  Badge,
  ButtonLink,
  Callout,
  Card,
  Eyebrow,
  PageHeader,
  ScrollX,
  SeatMeter,
  StatTile,
} from '@/components/ui'
import { formatSessionSlot } from '@/lib/format'

/**
 * Screen 18 — attendee list.
 *
 * Names and counts only. Tutors never see learner email addresses: it is what
 * keeps repeat business on the platform, and it is far harder to walk back later
 * than to get right now.
 */
export default async function AttendeesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const workshop = getWorkshop(slug) ?? notFound()
  const list = attendees.slice(0, workshop.seatsTaken)
  const confirmed = list.filter((a) => a.confirmedAttending).length

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        eyebrow={formatSessionSlot(workshop.startsAt)}
        title={workshop.title}
        lead={`${list.length} of ${workshop.maxSeats} seats sold.`}
        actions={
          <>
            <ButtonLink href={`/tutor/workshops/${workshop.slug}/greenroom`}>Green room</ButtonLink>
            <ButtonLink href={`/tutor/workshops/${workshop.slug}/creative`} variant="secondary">
              Poster
            </ButtonLink>
          </>
        }
      />

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Seats sold" value={`${list.length}/${workshop.maxSeats}`} />
        <StatTile label="Said they're coming" value={`${confirmed}`} tone="brand" />
        <StatTile label="No reply yet" value={`${list.length - confirmed}`} />
        <StatTile label="Expected turnout" value={`~${Math.round(confirmed * 0.9)}`} hint="Based on confirmations" />
      </div>

      <div className="mt-6">
        <SeatMeter taken={list.length} max={workshop.maxSeats} min={workshop.minSeats} />
      </div>

      <div className="mt-6">
        <Callout tone="neutral" title="You see names, not email addresses">
          If you need to reach everyone, post in the workshop chat — it goes to all twenty and stays
          open for thirty days after the session.
        </Callout>
      </div>

      <section className="mt-6">
        <Eyebrow>Who has a seat</Eyebrow>
        <ScrollX>
          <Card className="mt-3 min-w-[34rem] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-faint">
                  <th className="px-4 py-2.5 font-medium">Seat</th>
                  <th className="px-4 py-2.5 font-medium">Name</th>
                  <th className="px-4 py-2.5 font-medium">Confirmed</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {list.map((attendee) => (
                  <tr key={attendee.seatNumber}>
                    <td className="px-4 py-2.5 font-mono text-xs tabular text-ink-faint">
                      {String(attendee.seatNumber).padStart(2, '0')}
                    </td>
                    <td className="px-4 py-2.5">{attendee.name}</td>
                    <td className="px-4 py-2.5">
                      {attendee.confirmedAttending ? (
                        <span className="text-brand">Yes</span>
                      ) : (
                        <span className="text-ink-faint">No reply</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge tone="neutral">Booked</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </ScrollX>
      </section>
    </div>
  )
}
