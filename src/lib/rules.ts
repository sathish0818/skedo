/**
 * Every product rule in one file, so a policy change is a one-line edit rather
 * than a hunt through the codebase. Values marked OPEN are pending a decision
 * and are safe to change.
 */

export const SEATS = {
  /** Hard cap. The 40+20 format only works because the group is small. */
  MAX: 20,
  /** OPEN — below this the session moves a week instead of running. */
  MIN_TO_RUN: 5,
  /** How long a seat stays reserved while the learner completes checkout. */
  HOLD_MINUTES: 10,
} as const

export const SESSION = {
  DEMO_MINUTES: 40,
  QA_MINUTES: 20,
  get TOTAL_MINUTES() {
    return this.DEMO_MINUTES + this.QA_MINUTES
  },
  /** Doors open this long before the scheduled start. */
  JOIN_OPENS_MINUTES_BEFORE: 15,
  /** Tutor may still join this long after the start before we call it abandoned. */
  TUTOR_GRACE_MINUTES: 10,
  /** Tutor gone this long mid-session marks the session ABANDONED. */
  TUTOR_ABSENCE_ABANDON_MINUTES: 10,
} as const

export const CERTIFICATE = {
  /** 42 of 60 minutes present — 70%. */
  THRESHOLD_MINUTES: 42,
  /** Never "Certified Professional". This is proof of attendance, and says so. */
  TITLE: 'Certificate of Participation',
  CODE_PREFIX: 'SKD',
} as const

export const RECORDING = {
  /** Every buyer gets it, attended or not. */
  ACCESS_DAYS: 30,
  /** Live streams can only be watermarked; DRM is for recordings, later. */
  WATERMARK_LEARNER_EMAIL: true,
} as const

export const DEFERRAL = {
  /** One move, then the session expires and everyone is refunded. */
  MAX: 1,
  WEEKS_FORWARD: 1,
  /** Buyers get this long to confirm the new date or take a refund. */
  CONFIRM_WINDOW_HOURS: 24,
} as const

export const REFUND = {
  /** Learner may cancel themselves up to this many hours before the session. */
  LEARNER_WINDOW_HOURS: 24,
} as const

export const PAYOUT = {
  /** Released two days after the session ends — never before. A cancellation
   *  must cost the tutor, and that only works while we still hold the money. */
  HOLD_DAYS_AFTER_SESSION: 2,
} as const

export const TUTOR_TIER = {
  FREE: {
    /** A deferred session consumes the following week's slot. */
    SESSIONS_PER_WEEK: 1,
  },
} as const

export const CHAT = {
  /** Channel stays open after the session — isolation is the top drop-off driver. */
  OPEN_DAYS_AFTER_SESSION: 30,
} as const

/**
 * Phrases that may not appear in a workshop listing. The platform hosts the
 * claim, so under the Consumer Protection Act 2019 and the ASCI code the
 * liability is the platform's, not the tutor's.
 */
export const BANNED_CLAIM_PATTERNS: RegExp[] = [
  /\bguarantee(d|s)?\b/i,
  /\b100\s*%\s*(placement|job|success|refund)\b/i,
  /\bjob\s*(assured|guaranteed|placement)\b/i,
  /\bassured\s*(job|placement|salary|income)\b/i,
  /\bplacement\s*(guarantee|assurance)\b/i,
  /\bbecome\s+(an?\s+)?expert\s+in\s+\d+/i,
  /\b(get|land)\s+(a\s+)?job\s+in\s+\d+/i,
]

export type ClaimCheck = { ok: true } | { ok: false; matches: string[] }

export function checkClaims(...texts: (string | null | undefined)[]): ClaimCheck {
  const haystack = texts.filter(Boolean).join('\n')
  const matches = BANNED_CLAIM_PATTERNS.flatMap((pattern) => {
    const found = haystack.match(pattern)
    return found ? [found[0]] : []
  })
  return matches.length === 0 ? { ok: true } : { ok: false, matches }
}
