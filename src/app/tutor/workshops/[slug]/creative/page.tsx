import { notFound } from 'next/navigation'
import { getWorkshop } from '@/lib/mock'
import { Button, ButtonLink, Card, Eyebrow, PageHeader } from '@/components/ui'
import { formatDate, formatTime } from '@/lib/format'
import { formatINR } from '@/lib/money'

/**
 * Screen 17 — the auto-generated promotional creative.
 *
 * The whole model rests on the tutor promoting the session, so the poster has to
 * be ready the moment they publish. Square for feed, 9:16 for stories, plus
 * copy-paste caption text with their own link already in it.
 */
export default async function CreativePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const workshop = getWorkshop(slug) ?? notFound()
  const url = `skedo.in/w/${workshop.slug}`

  const caption = `I'm running a live 1-hour workshop: ${workshop.title}

${formatDate(workshop.startsAt)}, ${formatTime(workshop.startsAt)} IST · ${workshop.maxSeats} seats · ${
    workshop.pricePaise === 0 ? 'Free' : formatINR(workshop.pricePaise)
  }

${workshop.summary}

40 minutes of me building live, 20 minutes for your questions. Recording included.

Book here → ${url}`

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        eyebrow="Promote"
        title="Your poster is ready"
        lead="Post it today. Sessions that get shared once, the day before, are the ones that do not fill."
        actions={<ButtonLink href="/tutor" variant="secondary">Done</ButtonLink>}
      />

      <div className="mt-6 grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)]">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {/* Square, for feed */}
          <figure className="shrink-0">
            <div className="flex aspect-square w-64 flex-col justify-between rounded-card bg-brand p-5 text-brand-ink">
              <div className="flex items-center justify-between text-[0.6rem] font-medium tracking-[0.15em] uppercase opacity-80">
                <span>Live workshop</span>
                <span>{workshop.maxSeats} seats</span>
              </div>
              <div>
                <p className="font-display text-xl leading-tight">{workshop.title}</p>
                <p className="mt-2 text-xs opacity-80">{workshop.summary}</p>
              </div>
              <div className="text-xs">
                <p className="font-medium">
                  {formatDate(workshop.startsAt)} · {formatTime(workshop.startsAt)} IST
                </p>
                <p className="mt-1 opacity-80">
                  {workshop.tutor.name} · {workshop.pricePaise === 0 ? 'Free' : formatINR(workshop.pricePaise)}
                </p>
                <p className="mt-2 font-mono text-[0.6rem] opacity-70">{url}</p>
              </div>
            </div>
            <figcaption className="mt-2 text-center text-xs text-ink-faint">1080 × 1080 · feed</figcaption>
          </figure>

          {/* Vertical, for stories */}
          <figure className="shrink-0">
            <div className="flex aspect-[9/16] w-44 flex-col justify-between rounded-card border border-line bg-surface p-4">
              <p className="text-[0.6rem] font-medium tracking-[0.15em] uppercase text-accent">
                Live · {formatDate(workshop.startsAt)}
              </p>
              <div>
                <p className="font-display text-lg leading-tight">{workshop.title}</p>
                <p className="mt-2 text-[0.7rem] text-ink-soft">
                  {formatTime(workshop.startsAt)} IST · {workshop.maxSeats} seats
                </p>
              </div>
              <p className="font-mono text-[0.6rem] text-ink-faint">{url}</p>
            </div>
            <figcaption className="mt-2 text-center text-xs text-ink-faint">1080 × 1920 · story</figcaption>
          </figure>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-4">
            <Eyebrow>Caption — ready to paste</Eyebrow>
            <pre className="mt-3 max-h-64 overflow-auto rounded-card bg-surface-2 p-3 font-sans text-sm whitespace-pre-wrap text-ink-soft">
              {caption}
            </pre>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm">Copy caption</Button>
              <Button size="sm" variant="secondary">
                Download both images
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <Eyebrow>Your permanent link</Eyebrow>
            <p className="mt-2 font-mono text-sm">skedo.in/@{workshop.tutor.handle}</p>
            <p className="mt-2 text-sm text-ink-soft">
              Put this in your bio once and never update it again — every session you ever run shows up
              there automatically.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
