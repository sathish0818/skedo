import { notFound } from 'next/navigation'
import { getWorkshop, certificate } from '@/lib/mock'
import { Badge, ButtonLink, Callout, Card, Eyebrow } from '@/components/ui'
import { formatDateLong } from '@/lib/format'
import { RECORDING } from '@/lib/rules'

// Screen 10 — Recording player. Every buyer gets this, attended or not.
export default async function RecordingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const workshop = getWorkshop(slug) ?? notFound()
  const expiresIn = 23 // days — computed from the enrollment in the real thing

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Eyebrow>Recording</Eyebrow>
          <h1 className="mt-1 text-xl sm:text-2xl">{workshop.title}</h1>
        </div>
        <Badge tone={expiresIn <= 5 ? 'accent' : 'neutral'}>
          {expiresIn} of {RECORDING.ACCESS_DAYS} days left
        </Badge>
      </div>

      {/* 16:9 player. The watermark is the learner's own email — it does not stop
          a determined recorder, but it makes every leak traceable. */}
      <div className="relative mt-5 aspect-video w-full overflow-hidden rounded-card bg-ink">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-surface/70">
          <span className="flex size-14 items-center justify-center rounded-full border border-surface/30 text-xl">
            ▶
          </span>
          <p className="text-sm">Recorded session · 60 minutes</p>
        </div>
        <p
          aria-hidden
          className="pointer-events-none absolute top-4 right-4 rounded bg-ink/40 px-2 py-1 font-mono text-[0.6rem] text-surface/60"
        >
          {certificate.learnerName.toLowerCase().replace(/\s+/g, '.')}@example.com
        </p>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ink-soft">
            Recorded live on {formatDateLong(workshop.startsAt)} with {workshop.tutor.name}.
          </p>
          <Callout tone="neutral" title="This recording is yours alone">
            It is tied to your account and watermarked with your email. Downloads and sharing are
            disabled — if a copy shows up elsewhere, it is traceable back to this account.
          </Callout>

          <section>
            <h2 className="text-lg">Chapters</h2>
            <ol className="mt-2 divide-y divide-line border-y border-line">
              {workshop.agenda.map((item) => (
                <li key={item.at} className="flex items-baseline gap-4 py-2.5">
                  <span className="font-mono text-xs text-ink-faint tabular">
                    {item.at.split('–')[0]} min
                  </span>
                  <span className="text-sm">{item.label}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="flex flex-col gap-3">
          <Card className="p-4">
            <Eyebrow>Resources</Eyebrow>
            <ul className="mt-2 flex flex-col gap-2 text-sm">
              <li>
                <a href="#" className="text-brand hover:underline">
                  Figma file (view only) ↗
                </a>
              </li>
              <li>
                <a href="#" className="text-brand hover:underline">
                  Token naming cheatsheet ↗
                </a>
              </li>
            </ul>
          </Card>
          <ButtonLink href={`/chat/${workshop.slug}`} variant="secondary" full>
            Ask in the workshop chat
          </ButtonLink>
        </aside>
      </div>
    </div>
  )
}
