import { notFound } from 'next/navigation'
import { getWorkshop } from '@/lib/mock'
import { PriceTag, TutorCredibility } from '@/components/workshop'
import {
  Badge,
  ButtonLink,
  Callout,
  Card,
  DefinitionList,
  Eyebrow,
  SeatMeter,
} from '@/components/ui'
import { formatDateLong, formatRelative, formatSessionSlot } from '@/lib/format'
import { CERTIFICATE, RECORDING, SESSION } from '@/lib/rules'

/**
 * Screen 01 — the workshop sales page.
 *
 * This is the screen that decides whether a stranger pays. Everything the
 * research said drives refunds is answered here before checkout rather than
 * after: who it is for, what you need, which language, which device, whether
 * there is a recording, and what the certificate actually is.
 */
export default async function WorkshopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const workshop = getWorkshop(slug)
  if (!workshop) notFound()

  const soldOut = workshop.seatsTaken >= workshop.maxSeats
  const free = workshop.pricePaise === 0

  return (
    <article className="mx-auto max-w-6xl px-4 pb-28 sm:px-6 lg:pb-16">
      <div className="grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12 lg:py-12">
        <div className="flex flex-col gap-10">
          <header className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="brand">{formatRelative(workshop.startsAt)}</Badge>
              <Badge tone="neutral">{SESSION.TOTAL_MINUTES} minutes live</Badge>
              {soldOut && <Badge tone="accent">Sold out</Badge>}
            </div>
            <h1 className="text-3xl leading-[1.12] sm:text-4xl">{workshop.title}</h1>
            <p className="max-w-[58ch] text-lg text-ink-soft">{workshop.summary}</p>
            <p className="font-mono text-sm text-ink-soft">
              {formatDateLong(workshop.startsAt)} · {formatSessionSlot(workshop.startsAt).split('· ')[1]}
            </p>
          </header>

          <section className="flex flex-col gap-3">
            <h2 className="text-xl">What happens in the hour</h2>
            <ol className="divide-y divide-line border-y border-line">
              {workshop.agenda.map((item) => (
                <li key={item.at} className="grid gap-1 py-3 sm:grid-cols-[7rem_1fr] sm:gap-4">
                  <span className="font-mono text-xs text-ink-faint tabular">{item.at}</span>
                  <span className="text-sm">{item.label}</span>
                </li>
              ))}
            </ol>
            <p className="text-sm text-ink-faint">
              {SESSION.DEMO_MINUTES} minutes of demo, then {SESSION.QA_MINUTES} minutes of questions —
              ask in text, or request to unmute.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-xl">About this session</h2>
            {workshop.description.split('\n\n').map((para) => (
              <p key={para.slice(0, 24)} className="max-w-[62ch] text-ink-soft">
                {para}
              </p>
            ))}
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-xl">Before you book</h2>
            <DefinitionList
              items={[
                { term: 'Who this is for', detail: workshop.whoFor },
                { term: 'What you need', detail: workshop.prerequisites },
                { term: 'Language', detail: workshop.language },
                { term: 'Device', detail: workshop.recommendedDevice },
              ]}
            />
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-xl">What you get</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Card className="p-4">
                <Eyebrow>Recording</Eyebrow>
                <p className="mt-2 text-sm">
                  Yours for {RECORDING.ACCESS_DAYS} days — <strong>even if you cannot attend</strong>.
                  It is watermarked with your email and cannot be shared.
                </p>
              </Card>
              <Card className="p-4">
                <Eyebrow>Certificate</Eyebrow>
                <p className="mt-2 text-sm">
                  A {CERTIFICATE.TITLE.toLowerCase()} with a public verification link, issued only if
                  you attend at least {CERTIFICATE.THRESHOLD_MINUTES} of the{' '}
                  {SESSION.TOTAL_MINUTES} minutes.
                </p>
              </Card>
            </div>
            <Callout tone="neutral">
              Cancel yourself for a full refund up to 24 hours before the session. If fewer than{' '}
              {workshop.minSeats} people book, the session moves a week and you can confirm or take a
              refund.
            </Callout>
          </section>

          <TutorCredibility tutor={workshop.tutor} />
        </div>

        {/* Booking panel — sticky beside the content on desktop, a fixed bar on phones. */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card className="hidden flex-col gap-4 p-5 lg:flex">
            <div className="flex items-baseline justify-between gap-2">
              <PriceTag pricePaise={workshop.pricePaise} className="text-3xl" />
              {!free && <span className="text-xs text-ink-faint">one-time, GST included</span>}
            </div>
            <SeatMeter taken={workshop.seatsTaken} max={workshop.maxSeats} min={workshop.minSeats} />
            {soldOut ? (
              <ButtonLink href={`/w/${workshop.slug}/checkout?waitlist=1`} variant="secondary" full size="lg">
                Join the waitlist
              </ButtonLink>
            ) : (
              <ButtonLink href={`/w/${workshop.slug}/checkout`} full size="lg">
                {free ? 'Reserve a free seat' : 'Pay with UPI'}
              </ButtonLink>
            )}
            <p className="text-center text-xs text-ink-faint">
              UPI only · seat held for 10 minutes while you pay
            </p>
          </Card>
        </aside>
      </div>

      <div className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <PriceTag pricePaise={workshop.pricePaise} className="text-xl" />
            <p className="truncate text-xs text-ink-faint">
              {workshop.maxSeats - workshop.seatsTaken > 0
                ? `${workshop.maxSeats - workshop.seatsTaken} seats left`
                : 'Sold out'}
            </p>
          </div>
          <ButtonLink
            href={`/w/${workshop.slug}/checkout${soldOut ? '?waitlist=1' : ''}`}
            variant={soldOut ? 'secondary' : 'primary'}
            size="lg"
            className="shrink-0"
          >
            {soldOut ? 'Join waitlist' : free ? 'Reserve seat' : 'Pay with UPI'}
          </ButtonLink>
        </div>
      </div>
    </article>
  )
}
