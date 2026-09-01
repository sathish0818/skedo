import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getWorkshop } from '@/lib/mock'
import { Button, ButtonLink, Callout, Card, Eyebrow, PageHeader, SeatMeter } from '@/components/ui'
import { PriceTag } from '@/components/workshop'
import { formatSessionSlot } from '@/lib/format'
import { checkClaims } from '@/lib/rules'

// Screen 16 — Publish preview. Last look before it goes live and starts taking money.
export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const workshop = getWorkshop(slug) ?? notFound()

  const required = [
    { label: 'Title and summary', done: Boolean(workshop.title && workshop.summary) },
    { label: 'Full description', done: Boolean(workshop.description) },
    { label: 'Who this is for', done: Boolean(workshop.whoFor) },
    { label: 'What they need ready', done: Boolean(workshop.prerequisites) },
    { label: 'Language and device', done: Boolean(workshop.language && workshop.recommendedDevice) },
    { label: 'Date, time and price', done: true },
    { label: 'No guaranteed-outcome claims', done: checkClaims(workshop.title, workshop.summary, workshop.description).ok },
  ]
  const ready = required.every((r) => r.done)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        eyebrow="Preview"
        title="Ready to publish?"
        lead="Once a seat sells, the date and price are locked — everything else you can still edit."
        actions={
          <ButtonLink href={`/w/${workshop.slug}`} variant="secondary">
            Open as a learner
          </ButtonLink>
        }
      />

      <Card className="mt-6 flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-ink-faint">
              {formatSessionSlot(workshop.startsAt)}
            </p>
            <p className="mt-1 font-display text-xl">{workshop.title}</p>
            <p className="mt-1 max-w-[52ch] text-sm text-ink-soft">{workshop.summary}</p>
          </div>
          <PriceTag pricePaise={workshop.pricePaise} className="text-2xl" />
        </div>
        <SeatMeter taken={0} max={workshop.maxSeats} min={workshop.minSeats} />
      </Card>

      <section className="mt-6">
        <Eyebrow>Before it can go live</Eyebrow>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {required.map((item) => (
            <li key={item.label} className="flex items-center justify-between gap-3 py-2.5 text-sm">
              <span>{item.label}</span>
              <span className={item.done ? 'text-brand' : 'text-accent'}>
                {item.done ? '✓ Done' : 'Missing'}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6">
        <Callout tone="accent" title="Nobody will find this on their own">
          Skedo does not bring learners. Publishing makes the page live and the payment link work —
          filling twenty seats is your job. Grab the poster on the next screen and post it today, not
          the day before.
        </Callout>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button size="lg" disabled={!ready}>
          Publish workshop
        </Button>
        <ButtonLink href={`/tutor/workshops/${workshop.slug}/creative`} size="lg" variant="secondary">
          Publish and get the poster
        </ButtonLink>
        <Link href="/tutor" className="self-center px-2 text-sm text-ink-soft hover:text-ink">
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
