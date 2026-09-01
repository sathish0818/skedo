import Link from 'next/link'
import { Avatar, Badge, Card, SeatMeter, cn } from './ui'
import { formatSessionSlot, formatRelative } from '@/lib/format'
import { formatINR } from '@/lib/money'
import type { MockWorkshop } from '@/lib/mock'

export function PriceTag({ pricePaise, className }: { pricePaise: number; className?: string }) {
  return (
    <span className={cn('font-display tabular', className)}>
      {pricePaise === 0 ? 'Free' : formatINR(pricePaise)}
    </span>
  )
}

export function WorkshopCard({ workshop }: { workshop: MockWorkshop }) {
  const soldOut = workshop.seatsTaken >= workshop.maxSeats
  return (
    <Card as="li" className="flex flex-col overflow-hidden transition-colors hover:border-line-strong">
      <Link href={`/w/${workshop.slug}`} className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="font-mono text-[0.68rem] tracking-[0.1em] uppercase text-ink-faint">
              {formatSessionSlot(workshop.startsAt)}
            </p>
            <h3 className="text-lg leading-snug">{workshop.title}</h3>
          </div>
          <PriceTag pricePaise={workshop.pricePaise} className="shrink-0 text-lg" />
        </div>

        <p className="line-clamp-2 text-sm text-ink-soft">{workshop.summary}</p>

        <div className="mt-auto flex flex-col gap-3">
          <SeatMeter taken={workshop.seatsTaken} max={workshop.maxSeats} min={workshop.minSeats} />
          <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
            <span className="flex items-center gap-2 text-sm">
              <Avatar name={workshop.tutor.name} size="sm" />
              <span className="text-ink-soft">{workshop.tutor.name}</span>
            </span>
            {soldOut ? (
              <Badge tone="neutral">Sold out</Badge>
            ) : (
              <Badge tone="brand">{formatRelative(workshop.startsAt)}</Badge>
            )}
          </div>
        </div>
      </Link>
    </Card>
  )
}

export function TutorCredibility({ tutor }: { tutor: MockWorkshop['tutor'] }) {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <Avatar name={tutor.name} size="lg" />
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/@${tutor.handle}`} className="font-display text-lg hover:underline">
              {tutor.name}
            </Link>
            {tutor.verified && <Badge tone="brand">Verified</Badge>}
          </div>
          <p className="text-sm text-ink-soft">{tutor.headline}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-ink-soft">{tutor.bio}</p>

      <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4 text-center">
        {[
          { term: 'Sessions run', detail: String(tutor.sessionsRun) },
          { term: 'Attendance', detail: `${tutor.averageAttendance}%` },
          { term: 'Rating', detail: `${tutor.rating}/5` },
        ].map((stat) => (
          <div key={stat.term}>
            <dd className="font-display text-lg tabular">{stat.detail}</dd>
            <dt className="text-[0.68rem] uppercase tracking-wide text-ink-faint">{stat.term}</dt>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        {tutor.links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            rel="noreferrer noopener"
            target="_blank"
            className="rounded-full border border-line px-3 py-1 text-xs text-ink-soft hover:text-ink"
          >
            {link.label} ↗
          </a>
        ))}
      </div>
    </Card>
  )
}
