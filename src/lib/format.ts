import { SESSION } from './rules'

/** Everything a learner sees is in IST, regardless of where they are. */
export const IST = 'Asia/Kolkata'

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: IST,
  }).format(date)
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: IST,
  }).format(date)
}

/** "Sat, 13 Sep · 7:00 PM IST" — the one-line form used on cards and emails. */
export function formatSessionSlot(date: Date): string {
  return `${formatDate(date)} · ${formatTime(date)} IST`
}

export function formatDateLong(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: IST,
  }).format(date)
}

/** "in 3 days", "in 2 hours", "starting now", "2 days ago". */
export function formatRelative(date: Date, now: Date = new Date()): string {
  const diffMs = date.getTime() - now.getTime()
  const abs = Math.abs(diffMs)
  const mins = Math.round(abs / 60_000)

  if (mins < 2) return diffMs >= 0 ? 'starting now' : 'just now'

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const sign = diffMs >= 0 ? 1 : -1

  if (mins < 60) return rtf.format(sign * mins, 'minute')
  const hours = Math.round(mins / 60)
  if (hours < 24) return rtf.format(sign * hours, 'hour')
  const days = Math.round(hours / 24)
  if (days < 14) return rtf.format(sign * days, 'day')
  return rtf.format(sign * Math.round(days / 7), 'week')
}

export function sessionEndsAt(startsAt: Date): Date {
  return new Date(startsAt.getTime() + SESSION.TOTAL_MINUTES * 60_000)
}

export function joinOpensAt(startsAt: Date): Date {
  return new Date(startsAt.getTime() - SESSION.JOIN_OPENS_MINUTES_BEFORE * 60_000)
}

/** "6 seats left" — and the urgent variant the sales page leans on. */
export function seatsLeftLabel(taken: number, max: number): string {
  const left = Math.max(0, max - taken)
  if (left === 0) return 'Sold out'
  if (left === 1) return 'Last seat'
  return `${left} of ${max} seats left`
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

/** mm:ss, for the live-session clock. */
export function clock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const m = Math.floor(s / 60)
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
