/**
 * Money in Skedo is always an integer number of paise.
 *
 * Rupees as floats are how payment systems end up a paisa short and fail
 * reconciliation, so no rupee value ever leaves this module as a number — only
 * as a formatted string for display.
 */

/** Free is allowed. Anything paid must clear the gateway's floor. */
export const MIN_PAID_PRICE_PAISE = 4_900 // ₹49
export const MAX_PRICE_PAISE = 5_000_000 // ₹50,000 — sanity ceiling, not a policy

/** Platform defaults. Stored per product, so changing these affects new products only. */
export const DEFAULT_COMMISSION_BPS = 2_000 // 20%
export const DEFAULT_COMMISSION_CAP_PAISE = 250_000 // ₹2,500 per session
/** TDS under section 194-O on e-commerce payouts. */
export const TDS_BPS = 100 // 1%

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100)
}

/** For display only. Never feed this back into a calculation. */
export function formatINR(paise: number, opts: { withDecimals?: boolean } = {}): string {
  const showDecimals = opts.withDecimals ?? paise % 100 !== 0
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(paise / 100)
}

export type PriceValidation = { ok: true } | { ok: false; reason: string }

export function validatePrice(pricePaise: number): PriceValidation {
  if (!Number.isInteger(pricePaise)) {
    return { ok: false, reason: 'Price must be a whole number of paise.' }
  }
  if (pricePaise < 0) {
    return { ok: false, reason: 'Price cannot be negative.' }
  }
  if (pricePaise === 0) {
    return { ok: true } // free workshop
  }
  if (pricePaise < MIN_PAID_PRICE_PAISE) {
    return {
      ok: false,
      reason: `Paid workshops start at ${formatINR(MIN_PAID_PRICE_PAISE)}. Below that, make it free instead — payment fees would cost more than the ticket.`,
    }
  }
  if (pricePaise > MAX_PRICE_PAISE) {
    return { ok: false, reason: `Maximum price is ${formatINR(MAX_PRICE_PAISE)}.` }
  }
  return { ok: true }
}

export type SessionEarnings = {
  /** What learners paid in total. */
  grossPaise: number
  /** What Skedo keeps, after the cap is applied. */
  commissionPaise: number
  /** Whether the cap actually bit — worth surfacing to the tutor. */
  commissionCapped: boolean
  /** TDS 194-O, withheld by the platform and deposited on the tutor's behalf. */
  tdsPaise: number
  /** What reaches the tutor. */
  netPaise: number
  /** Commission as an effective percentage of gross, for display. */
  effectiveRatePercent: number
}

/**
 * Works out a session's split.
 *
 * The cap is what keeps a high-ticket tutor from handing over ₹20,000 for a
 * video room: a ₹499 session pays the full 20%, a ₹5,000 session pays ₹2,500
 * instead of ₹20,000.
 */
export function calculateEarnings(input: {
  pricePaise: number
  confirmedSeats: number
  commissionRateBps?: number
  commissionCapPaise?: number | null
  /** Free seats (manual, bulk, comped) earn no commission. */
  chargeableSeats?: number
}): SessionEarnings {
  const {
    pricePaise,
    confirmedSeats,
    commissionRateBps = DEFAULT_COMMISSION_BPS,
    commissionCapPaise = DEFAULT_COMMISSION_CAP_PAISE,
  } = input

  const chargeable = input.chargeableSeats ?? confirmedSeats
  const grossPaise = pricePaise * chargeable

  const uncappedCommission = Math.round((grossPaise * commissionRateBps) / 10_000)
  const cap = commissionCapPaise ?? Number.POSITIVE_INFINITY
  const commissionPaise = Math.min(uncappedCommission, cap)

  const tdsPaise = Math.round((grossPaise * TDS_BPS) / 10_000)
  const netPaise = grossPaise - commissionPaise - tdsPaise

  return {
    grossPaise,
    commissionPaise,
    commissionCapped: uncappedCommission > commissionPaise,
    tdsPaise,
    netPaise,
    effectiveRatePercent:
      grossPaise === 0 ? 0 : Math.round((commissionPaise / grossPaise) * 1_000) / 10,
  }
}

/**
 * What the tutor is shown before they publish: "you receive ₹399 of every ₹499".
 * Per-seat, because that is the number a tutor actually reasons about.
 */
export function perSeatEarning(input: {
  pricePaise: number
  commissionRateBps?: number
}): { tutorPaise: number; platformPaise: number } {
  const { pricePaise, commissionRateBps = DEFAULT_COMMISSION_BPS } = input
  const platformPaise = Math.round((pricePaise * commissionRateBps) / 10_000)
  const tdsPaise = Math.round((pricePaise * TDS_BPS) / 10_000)
  return { tutorPaise: pricePaise - platformPaise - tdsPaise, platformPaise }
}
