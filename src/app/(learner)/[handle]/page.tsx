import { notFound } from 'next/navigation'
import { tutor, workshops } from '@/lib/mock'
import { WorkshopCard } from '@/components/workshop'
import { Avatar, Badge, Card, EmptyState, Eyebrow } from '@/components/ui'

/**
 * Screen 22 — the tutor's permanent public page, at /@handle.
 *
 * This is the single link a tutor reuses in every bio and every post forever, so
 * it has to carry credibility on its own: who they are, what they have run, and
 * everything currently open for booking.
 */
export default async function TutorPublicPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const decoded = decodeURIComponent(handle)

  // Only @-prefixed paths are tutor pages; anything else is a real 404.
  if (!decoded.startsWith('@')) notFound()
  if (decoded.slice(1) !== tutor.handle) notFound()

  const upcoming = workshops.filter((w) => w.status === 'PUBLISHED' && w.tutor.handle === tutor.handle)
  const past = workshops.filter((w) => w.status === 'COMPLETED' && w.tutor.handle === tutor.handle)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="flex flex-col gap-5 border-b border-line pb-8 sm:flex-row sm:items-start sm:gap-6">
        <Avatar name={tutor.name} size="lg" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-3xl">{tutor.name}</h1>
            {tutor.verified && <Badge tone="brand">Verified tutor</Badge>}
          </div>
          <p className="text-ink-soft">{tutor.headline}</p>
          <p className="max-w-[62ch] text-sm text-ink-soft">{tutor.bio}</p>
          <ul className="mt-1 flex flex-wrap gap-2">
            {tutor.skills.map((skill) => (
              <li key={skill} className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs text-ink-soft">
                {skill}
              </li>
            ))}
          </ul>
        </div>
        <Card className="grid shrink-0 grid-cols-3 gap-4 p-4 text-center sm:w-56">
          {[
            { label: 'Sessions', value: String(tutor.sessionsRun) },
            { label: 'Attendance', value: `${tutor.averageAttendance}%` },
            { label: 'Rating', value: `${tutor.rating}` },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-lg tabular">{stat.value}</p>
              <Eyebrow className="mt-0.5">{stat.label}</Eyebrow>
            </div>
          ))}
        </Card>
      </header>

      <section className="py-8">
        <h2 className="text-xl">Open for booking</h2>
        {upcoming.length > 0 ? (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {upcoming.map((workshop) => (
              <WorkshopCard key={workshop.slug} workshop={workshop} />
            ))}
          </ul>
        ) : (
          <div className="mt-5">
            <EmptyState title="Nothing scheduled right now">
              Follow along — new sessions are announced here first.
            </EmptyState>
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section className="border-t border-line py-8">
          <h2 className="text-xl">Previously run</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {past.map((workshop) => (
              <li key={workshop.slug} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                <span className="text-sm">{workshop.title}</span>
                <span className="text-xs text-ink-faint tabular">
                  {workshop.seatsTaken} attended
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
