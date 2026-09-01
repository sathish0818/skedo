import { notFound } from 'next/navigation'
import { attendees, getWorkshop } from '@/lib/mock'
import { ButtonLink, Callout, Card, Eyebrow, PageHeader } from '@/components/ui'
import { Preflight } from '@/components/preflight'
import { formatTime, joinOpensAt } from '@/lib/format'
import { SESSION } from '@/lib/rules'

// Screen 19 — Green room. Nobody sees you here. Break things now, not at 7:01.
export default async function GreenRoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const workshop = getWorkshop(slug) ?? notFound()
  const waiting = attendees.filter((a) => a.confirmedAttending).length

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        eyebrow="Green room"
        title="Check everything before you go live"
        lead="Learners cannot see or hear you in here."
        actions={
          <ButtonLink href={`/tutor/workshops/${workshop.slug}/live`} size="lg">
            Go live
          </ButtonLink>
        }
      />

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Card className="overflow-hidden">
            <div className="flex aspect-video items-center justify-center bg-ink text-sm text-surface/50">
              Your camera preview
            </div>
            <div className="flex flex-wrap gap-2 p-3">
              <ButtonLink href="#" size="sm" variant="secondary">
                Switch camera
              </ButtonLink>
              <ButtonLink href="#" size="sm" variant="secondary">
                Test screen share
              </ButtonLink>
            </div>
          </Card>
          <Preflight />
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <Eyebrow>Run of show</Eyebrow>
            <ol className="mt-3 divide-y divide-line">
              {workshop.agenda.map((item) => (
                <li key={item.at} className="grid gap-1 py-2.5 sm:grid-cols-[6rem_1fr] sm:gap-3">
                  <span className="font-mono text-xs text-ink-faint tabular">{item.at}</span>
                  <span className="text-sm">{item.label}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-ink-faint">
              The room shows you a countdown and switches to the Q&amp;A phase automatically at{' '}
              {SESSION.DEMO_MINUTES} minutes.
            </p>
          </Card>

          <Card className="p-5">
            <Eyebrow>Waiting outside</Eyebrow>
            <p className="mt-2 font-display text-2xl tabular">{waiting} learners</p>
            <p className="mt-1 text-sm text-ink-soft">
              Doors opened at {formatTime(joinOpensAt(workshop.startsAt))}.
            </p>
          </Card>

          <Callout tone="neutral" title="If your connection dies mid-session">
            Come back within {SESSION.TOTAL_MINUTES > 0 ? SESSION.TOTAL_MINUTES : 0} minutes and the room
            is still yours. Gone longer than {SESSION.TUTOR_ABSENCE_ABANDON_MINUTES} minutes and the
            session is marked incomplete — learners get a refund or a reschedule, and your payout is held
            for review.
          </Callout>
        </div>
      </div>
    </div>
  )
}
