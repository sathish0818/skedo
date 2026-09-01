import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-card font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none text-center'

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-brand-ink hover:bg-brand-hover',
  secondary: 'bg-surface text-ink border border-line-strong hover:bg-surface-2',
  ghost: 'text-ink-soft hover:text-ink hover:bg-surface-2',
  danger: 'bg-danger-tint text-danger border border-danger/25 hover:bg-danger/15',
}

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-[0.95rem] px-4 py-2.5',
  lg: 'text-base px-5 py-3',
}

type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  full?: boolean
  children: ReactNode
  className?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  full,
  className,
  children,
  ...rest
}: ButtonProps & Omit<ComponentProps<'button'>, 'className' | 'children'>) {
  return (
    <button
      className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], full && 'w-full', className)}
      {...rest}
    >
      {children}
    </button>
  )
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  full,
  className,
  children,
  href,
  ...rest
}: ButtonProps & { href: string } & Omit<ComponentProps<typeof Link>, 'className' | 'children' | 'href'>) {
  return (
    <Link
      href={href}
      className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], full && 'w-full', className)}
      {...rest}
    >
      {children}
    </Link>
  )
}

// ---------------------------------------------------------------------------
// Surfaces
// ---------------------------------------------------------------------------

export function Card({
  as: As = 'div',
  className,
  children,
}: {
  as?: 'div' | 'section' | 'article' | 'li'
  className?: string
  children: ReactNode
}) {
  return (
    <As className={cn('rounded-card border border-line bg-surface', className)}>{children}</As>
  )
}

export function Callout({
  tone = 'neutral',
  title,
  children,
}: {
  tone?: 'neutral' | 'brand' | 'accent' | 'danger'
  title?: string
  children: ReactNode
}) {
  const tones = {
    neutral: 'border-line bg-surface-2 text-ink-soft',
    brand: 'border-brand/25 bg-brand-tint text-ink',
    accent: 'border-accent/30 bg-accent-tint text-ink',
    danger: 'border-danger/25 bg-danger-tint text-ink',
  } as const
  return (
    <div className={cn('rounded-card border px-4 py-3 text-sm', tones[tone])}>
      {title && <p className="mb-1 font-semibold text-ink">{title}</p>}
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

type BadgeTone = 'neutral' | 'brand' | 'accent' | 'danger' | 'live'

export function Badge({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: BadgeTone
  children: ReactNode
  className?: string
}) {
  const tones: Record<BadgeTone, string> = {
    neutral: 'bg-surface-2 text-ink-soft',
    brand: 'bg-brand-tint text-brand',
    accent: 'bg-accent-tint text-accent',
    danger: 'bg-danger-tint text-danger',
    live: 'bg-live/12 text-live',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {tone === 'live' && (
        <span className="size-1.5 rounded-full bg-live motion-safe:animate-pulse" aria-hidden />
      )}
      {children}
    </span>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'font-mono text-[0.68rem] font-medium tracking-[0.12em] uppercase text-ink-faint',
        className,
      )}
    >
      {children}
    </p>
  )
}

// ---------------------------------------------------------------------------
// Page furniture
// ---------------------------------------------------------------------------

export function PageHeader({
  eyebrow,
  title,
  lead,
  actions,
}: {
  eyebrow?: string
  title: string
  lead?: string
  actions?: ReactNode
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-2">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="text-2xl sm:text-3xl">{title}</h1>
        {lead && <p className="max-w-[60ch] text-ink-soft">{lead}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  )
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string
  children?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="rounded-card border border-dashed border-line-strong px-6 py-12 text-center">
      <p className="font-display text-lg">{title}</p>
      {children && <p className="mx-auto mt-2 max-w-[45ch] text-sm text-ink-soft">{children}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}

export function StatTile({
  label,
  value,
  hint,
  tone = 'neutral',
}: {
  label: string
  value: string
  hint?: string
  tone?: 'neutral' | 'brand' | 'accent'
}) {
  const valueTone = {
    neutral: 'text-ink',
    brand: 'text-brand',
    accent: 'text-accent',
  }[tone]
  return (
    <Card className="p-4">
      <Eyebrow>{label}</Eyebrow>
      <p className={cn('mt-2 font-display text-2xl tabular', valueTone)}>{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-faint">{hint}</p>}
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Seat meter — the scarcity signal the sales page depends on
// ---------------------------------------------------------------------------

export function SeatMeter({
  taken,
  max,
  min,
  showLegend = true,
}: {
  taken: number
  max: number
  min?: number
  showLegend?: boolean
}) {
  const left = Math.max(0, max - taken)
  const urgent = left > 0 && left <= 5
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-[3px]" role="img" aria-label={`${taken} of ${max} seats taken`}>
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className={cn(
              'h-5 w-2.5 rounded-[2px] rounded-b-[3px]',
              i < taken ? 'bg-brand' : 'bg-surface-3',
              min !== undefined && i === min - 1 && i >= taken && 'ring-1 ring-accent',
            )}
          />
        ))}
      </div>
      {showLegend && (
        <p className={cn('text-xs tabular', urgent ? 'font-medium text-accent' : 'text-ink-faint')}>
          {left === 0 ? 'Sold out' : left === 1 ? 'Last seat' : `${left} of ${max} seats left`}
          {min !== undefined && taken < min && ` · needs ${min - taken} more to run`}
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Forms
// ---------------------------------------------------------------------------

export function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </span>
      {hint && <span className="text-xs text-ink-faint">{hint}</span>}
      {children}
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  )
}

const controlClass =
  'w-full rounded-card border border-line-strong bg-surface px-3 py-2.5 text-[0.95rem] text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none'

export function Input({ className, ...rest }: ComponentProps<'input'>) {
  return <input className={cn(controlClass, className)} {...rest} />
}

export function Textarea({ className, ...rest }: ComponentProps<'textarea'>) {
  return <textarea className={cn(controlClass, 'min-h-24 resize-y', className)} {...rest} />
}

export function Select({ className, children, ...rest }: ComponentProps<'select'>) {
  return (
    <select className={cn(controlClass, 'appearance-none pr-8', className)} {...rest}>
      {children}
    </select>
  )
}

// ---------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'size-8 text-xs', md: 'size-11 text-sm', lg: 'size-16 text-lg' }
  const letters = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-brand-tint font-medium text-brand',
        sizes[size],
      )}
    >
      {letters}
    </span>
  )
}

/** Wide content must scroll inside itself, never make the page scroll sideways. */
export function ScrollX({ children }: { children: ReactNode }) {
  return <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">{children}</div>
}

export function DefinitionList({ items }: { items: { term: string; detail: ReactNode }[] }) {
  return (
    <dl className="divide-y divide-line">
      {items.map((item) => (
        <div key={item.term} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
          <dt className="text-sm font-medium text-ink-soft">{item.term}</dt>
          <dd className="text-sm">{item.detail}</dd>
        </div>
      ))}
    </dl>
  )
}
