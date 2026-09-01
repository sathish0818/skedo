'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { cn } from './ui'

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('inline-flex items-baseline gap-1.5', className)}>
      <span className="font-display text-xl leading-none tracking-tight">Skedo</span>
      <span className="mb-0.5 size-1.5 rounded-full bg-accent" aria-hidden />
    </Link>
  )
}

const learnerNav = [
  { href: '/', label: 'Browse' },
  { href: '/bookings', label: 'My bookings' },
]

export function LearnerHeader() {
  const pathname = usePathname()
  return (
    <header className="pt-safe sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-1 text-sm">
          {learnerNav.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-card px-3 py-1.5 transition-colors',
                  active ? 'bg-surface-2 font-medium text-ink' : 'text-ink-soft hover:text-ink',
                )}
              >
                {item.label}
              </Link>
            )
          })}
          <Link
            href="/tutor"
            className="ml-1 rounded-card border border-line-strong px-3 py-1.5 text-ink-soft hover:text-ink"
          >
            Teach
          </Link>
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="pb-safe mt-16 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Skedo — one-hour live workshops.</p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/verify/SKD-4K7P-92MX" className="hover:text-ink">
            Verify a certificate
          </Link>
          <Link href="/signup" className="hover:text-ink">
            Teach on Skedo
          </Link>
        </nav>
      </div>
    </footer>
  )
}

const tutorNav = [
  { href: '/tutor', label: 'Dashboard', icon: '▤' },
  { href: '/tutor/workshops/new', label: 'New', icon: '＋' },
  { href: '/tutor/profile', label: 'Profile', icon: '☺' },
  { href: '/@sathish', label: 'Public', icon: '↗' },
]

/**
 * Sidebar on large screens, bottom tab bar on phones. The bottom bar sits above
 * the home-bar inset, which is what `pb-safe` is for.
 */
export function TutorShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/tutor' ? pathname === '/tutor' : pathname.startsWith(href)

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <aside className="pt-safe sticky top-0 z-30 flex flex-col border-b border-line bg-paper lg:h-dvh lg:w-60 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="flex h-14 items-center justify-between px-4 lg:h-auto lg:px-5 lg:py-6">
          <Logo />
          <span className="rounded-full bg-brand-tint px-2 py-0.5 text-[0.68rem] font-medium text-brand lg:hidden">
            Tutor
          </span>
        </div>
        <nav className="hidden flex-col gap-1 px-3 lg:flex">
          {tutorNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 rounded-card px-3 py-2 text-sm transition-colors',
                isActive(item.href)
                  ? 'bg-brand-tint font-medium text-brand'
                  : 'text-ink-soft hover:bg-surface-2 hover:text-ink',
              )}
            >
              <span aria-hidden className="w-4 text-center">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto hidden px-5 py-6 text-xs text-ink-faint lg:block">
          Phase 1 · one tutor, no payouts yet
        </div>
      </aside>

      <main className="flex-1 pb-24 lg:pb-0">{children}</main>

      <nav className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 backdrop-blur lg:hidden">
        <ul className="flex">
          {tutorNav.map((item) => (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 py-2 text-[0.68rem]',
                  isActive(item.href) ? 'text-brand' : 'text-ink-faint',
                )}
              >
                <span aria-hidden className="text-base leading-none">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
