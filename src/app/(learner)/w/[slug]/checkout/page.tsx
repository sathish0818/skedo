import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getWorkshop } from '@/lib/mock'
import { Badge, Button, Callout, Card, Field, Input, SeatMeter } from '@/components/ui'
import { PriceTag } from '@/components/workshop'
import { formatSessionSlot } from '@/lib/format'
import { formatINR } from '@/lib/money'
import { SEATS } from '@/lib/rules'

// Screen 03 — Checkout. UPI only; cards and netbanking are deliberately off.
export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ waitlist?: string }>
}) {
  const { slug } = await params
  const { waitlist } = await searchParams
  const workshop = getWorkshop(slug)
  if (!workshop) notFound()

  const isWaitlist = waitlist === '1'
  const free = workshop.pricePaise === 0

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href={`/w/${workshop.slug}`} className="text-sm text-ink-soft hover:text-ink">
        ← Back to the workshop
      </Link>

      <h1 className="mt-4 text-2xl sm:text-3xl">
        {isWaitlist ? 'Join the waitlist' : free ? 'Reserve your seat' : 'Pay and reserve your seat'}
      </h1>

      <Card className="mt-6 flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-ink-faint">
              {formatSessionSlot(workshop.startsAt)}
            </p>
            <p className="mt-1 font-display text-lg">{workshop.title}</p>
            <p className="text-sm text-ink-soft">with {workshop.tutor.name}</p>
          </div>
          <PriceTag pricePaise={workshop.pricePaise} className="text-2xl" />
        </div>
        <SeatMeter taken={workshop.seatsTaken} max={workshop.maxSeats} min={workshop.minSeats} />
      </Card>

      {!isWaitlist && (
        <Callout tone="accent" title={`Your seat is held for ${SEATS.HOLD_MINUTES} minutes`}>
          Complete the payment within that window or the seat goes back on sale.
        </Callout>
      )}

      <form className="mt-6 flex flex-col gap-5">
        <Field
          label="Email address"
          required
          hint="Your certificate and the recording are sent here, so it must be one you can open."
        >
          <Input type="email" name="email" autoComplete="email" inputMode="email" placeholder="you@example.com" required />
        </Field>

        <Field
          label="WhatsApp number"
          required
          hint="Reminders go out here 24 hours, 1 hour and 10 minutes before. This is the single biggest thing that stops people missing the session."
        >
          <Input
            type="tel"
            name="phone"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+91 98765 43210"
            required
          />
        </Field>

        <Field label="Your name" required hint="Printed on your certificate exactly as typed.">
          <Input name="name" autoComplete="name" placeholder="Priya Ramanathan" required />
        </Field>

        {isWaitlist ? (
          <>
            <Callout tone="neutral">
              We will message you the moment a seat opens up. Waitlist seats are first come, first
              served — no payment now.
            </Callout>
            <Button size="lg" full type="submit">
              Join the waitlist
            </Button>
          </>
        ) : (
          <>
            {!free && (
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-1 text-sm font-medium">Payment method</legend>
                <label className="flex items-center gap-3 rounded-card border border-brand bg-brand-tint px-4 py-3">
                  <input type="radio" name="method" value="upi" defaultChecked className="accent-brand" />
                  <span className="flex-1 text-sm font-medium">UPI</span>
                  <Badge tone="brand">GPay · PhonePe · Paytm</Badge>
                </label>
                <p className="text-xs text-ink-faint">
                  UPI only for now. It is how most people in India pay, and it costs the least — which
                  keeps ticket prices down.
                </p>
              </fieldset>
            )}

            <dl className="flex flex-col gap-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">One seat</dt>
                <dd className="tabular">{free ? 'Free' : formatINR(workshop.pricePaise)}</dd>
              </div>
              <div className="flex justify-between font-medium">
                <dt>Total</dt>
                <dd className="tabular">{free ? 'Free' : formatINR(workshop.pricePaise)}</dd>
              </div>
            </dl>

            <Button size="lg" full type="submit">
              {free ? 'Reserve my seat' : `Pay ${formatINR(workshop.pricePaise)} with UPI`}
            </Button>

            <p className="text-center text-xs text-ink-faint">
              Full refund if you cancel up to 24 hours before, or if the session does not run.
            </p>
          </>
        )}
      </form>
    </div>
  )
}
