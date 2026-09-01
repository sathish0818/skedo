'use client'

import { useMemo, useState } from 'react'
import { Badge, Button, Callout, Card, Eyebrow, Field, Input, Select, Textarea } from './ui'
import { checkClaims, SEATS, SESSION } from '@/lib/rules'
import { calculateEarnings, formatINR, perSeatEarning, rupeesToPaise, validatePrice } from '@/lib/money'

/**
 * Screen 15 — create or edit a workshop.
 *
 * Two things here are not cosmetic:
 *  - Every field a learner needs before buying is required, because vague
 *    listings are the documented root of refund requests.
 *  - Outcome claims are blocked as you type. Skedo hosts the claim, so the
 *    liability for "guaranteed placement" is Skedo's, not the tutor's.
 */
export function WorkshopForm() {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [priceRupees, setPriceRupees] = useState('499')

  const claim = useMemo(() => checkClaims(title, summary), [title, summary])

  const pricePaise = rupeesToPaise(Number(priceRupees) || 0)
  const priceCheck = validatePrice(pricePaise)
  const perSeat = perSeatEarning({ pricePaise })
  const soldOut = calculateEarnings({ pricePaise, confirmedSeats: SEATS.MAX })

  return (
    <form className="flex flex-col gap-5">
      <Card className="flex flex-col gap-5 p-5">
        <div>
          <h2 className="text-lg">The basics</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Write the title the way you would say it out loud.
          </p>
        </div>

        <Field label="Title" required error={!claim.ok ? undefined : undefined}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Figma to production, without the handoff mess"
            maxLength={90}
          />
        </Field>

        <Field
          label="One-line summary"
          required
          hint="Shown on cards and in the poster. What someone walks away able to do."
        >
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={2}
            maxLength={180}
            placeholder="Take one real screen from a Figma file to shipped code."
          />
        </Field>

        {!claim.ok && (
          <Callout tone="danger" title="This cannot be published as written">
            Remove {claim.matches.map((m) => `“${m}”`).join(', ')}. Guaranteed outcomes and placement
            claims are not allowed — Skedo is legally responsible for claims on its own pages, and
            these are the exact phrases consumer commissions award compensation over.
          </Callout>
        )}

        <Field label="Full description" required hint="Two or three paragraphs. What you will actually do on screen.">
          <Textarea rows={6} placeholder="We take a single screen and walk the whole distance…" />
        </Field>
      </Card>

      <Card className="flex flex-col gap-5 p-5">
        <div>
          <h2 className="text-lg">What a learner needs to know before paying</h2>
          <p className="mt-1 text-sm text-ink-soft">
            All required. Most refund requests come from someone who did not know one of these.
          </p>
        </div>

        <Field label="Who this is for" required hint="Be specific enough that the wrong person self-selects out.">
          <Textarea rows={2} placeholder="Designers with 1–5 years who hand files to developers…" />
        </Field>

        <Field label="What they need ready" required hint="Accounts, software, prior knowledge.">
          <Textarea rows={2} placeholder="A free Figma account. No code required." />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Language" required>
            <Input defaultValue="English" placeholder="English, with Tamil for questions" />
          </Field>
          <Field label="Recommended device" required>
            <Select defaultValue="laptop">
              <option value="any">Any device, including phone</option>
              <option value="laptop">Laptop or iPad — screen share is detailed</option>
              <option value="laptop-only">Laptop only</option>
            </Select>
          </Field>
        </div>
      </Card>

      <Card className="flex flex-col gap-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg">When and how much</h2>
          <Badge tone="neutral">
            {SESSION.DEMO_MINUTES} min demo + {SESSION.QA_MINUTES} min Q&amp;A
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date" required>
            <Input type="date" />
          </Field>
          <Field label="Start time (IST)" required>
            <Input type="time" defaultValue="19:00" />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Price in rupees"
            required
            hint="0 for free, or ₹49 and up."
            error={priceCheck.ok ? undefined : priceCheck.reason}
          >
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              value={priceRupees}
              onChange={(e) => setPriceRupees(e.target.value)}
            />
          </Field>
          <Field label="Seats" hint={`Capped at ${SEATS.MAX} — the format needs a small group.`}>
            <Input type="number" defaultValue={SEATS.MAX} max={SEATS.MAX} disabled />
          </Field>
        </div>

        {/* Total transparency on fees is the cheapest possible differentiator:
            delayed payouts and surprise deductions are the loudest complaint
            creators have about every existing platform. */}
        <div className="rounded-card border border-brand/25 bg-brand-tint p-4">
          <Eyebrow>What you receive</Eyebrow>
          {pricePaise === 0 ? (
            <p className="mt-2 text-sm">
              Free workshop — no payment, no commission. Good for building an audience.
            </p>
          ) : (
            <>
              <p className="mt-2 font-display text-2xl tabular">
                {formatINR(perSeat.tutorPaise)}{' '}
                <span className="font-sans text-sm font-normal text-ink-soft">
                  of every {formatINR(pricePaise)}
                </span>
              </p>
              <dl className="mt-3 flex flex-col gap-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Skedo commission (20%)</dt>
                  <dd className="tabular">− {formatINR(perSeat.platformPaise)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">TDS 194-O (1%)</dt>
                  <dd className="tabular">− {formatINR(Math.round(pricePaise / 100))}</dd>
                </div>
                <div className="flex justify-between border-t border-brand/20 pt-1 font-medium">
                  <dt>If all {SEATS.MAX} seats sell</dt>
                  <dd className="tabular">{formatINR(soldOut.netPaise)}</dd>
                </div>
              </dl>
              {soldOut.commissionCapped && (
                <p className="mt-2 text-xs text-ink-soft">
                  Commission is capped at {formatINR(250_000)} per session, so your effective rate here
                  is {soldOut.effectiveRatePercent}% rather than 20%.
                </p>
              )}
              <p className="mt-2 text-xs text-ink-faint">
                Paid out two days after the session ends. No other deductions, ever.
              </p>
            </>
          )}
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button size="lg" type="submit" disabled={!claim.ok || !priceCheck.ok}>
          Save and preview
        </Button>
        <Button size="lg" variant="secondary" type="button">
          Save as draft
        </Button>
      </div>
    </form>
  )
}
