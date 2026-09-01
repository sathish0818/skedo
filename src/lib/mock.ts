/**
 * Sample content so every screen can be designed, reviewed and clicked through
 * before a database exists.
 *
 * This file is the ONLY place mock data lives. Each screen reads from it through
 * a `get*` function whose shape matches the eventual Prisma query, so swapping
 * to the real database is a change here and nowhere else.
 */

import { SEATS, SESSION } from './rules'

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

function at(daysFromNow: number, hour: number, minute = 0): Date {
  const d = new Date(Date.now() + daysFromNow * DAY)
  // Times are authored in IST; the offset keeps the mock stable wherever it runs.
  d.setUTCHours(hour - 5, minute - 30, 0, 0)
  return d
}

export type MockTutor = {
  handle: string
  name: string
  headline: string
  credential: string
  bio: string
  skills: string[]
  verified: boolean
  sessionsRun: number
  averageAttendance: number
  rating: number
  links: { label: string; url: string }[]
}

export type MockWorkshop = {
  slug: string
  title: string
  summary: string
  description: string
  whoFor: string
  prerequisites: string
  language: string
  recommendedDevice: string
  agenda: { at: string; label: string }[]
  pricePaise: number
  startsAt: Date
  seatsTaken: number
  maxSeats: number
  minSeats: number
  status: 'PUBLISHED' | 'DRAFT' | 'DEFERRED' | 'COMPLETED' | 'LIVE'
  tutor: MockTutor
}

export const tutor: MockTutor = {
  handle: 'sathish',
  name: 'Sathish S',
  headline: 'Product designer · 9 years shipping design systems',
  credential: 'Lead Product Designer, ESDS',
  bio: 'I design and ship interfaces for a living, and I have spent the last four years untangling the handoff between design and engineering. These sessions are the things I wish someone had told me in year two — practical, opinionated, and drawn from production work rather than tutorials.',
  skills: ['Figma', 'Design systems', 'Design tokens', 'Handoff', 'Prototyping'],
  verified: true,
  sessionsRun: 12,
  averageAttendance: 84,
  rating: 4.7,
  links: [
    { label: 'LinkedIn', url: 'https://linkedin.com' },
    { label: 'Portfolio', url: 'https://example.com' },
  ],
}

const secondTutor: MockTutor = {
  ...tutor,
  handle: 'meera',
  name: 'Meera Krishnan',
  headline: 'Frontend engineer · design systems in production',
  credential: 'Senior Engineer, Zerodha',
  bio: 'I build the component libraries that designers hand over, and I have opinions about why they break.',
  skills: ['React', 'CSS architecture', 'Accessibility'],
  sessionsRun: 5,
  averageAttendance: 91,
  rating: 4.9,
}

export const workshops: MockWorkshop[] = [
  {
    slug: 'figma-to-production',
    title: 'Figma to production, without the handoff mess',
    summary:
      'Take one real screen from a Figma file to shipped code — tokens, components, and the decisions that actually cause rework.',
    description:
      'We take a single screen and walk the whole distance: naming and structuring layers so they survive contact with engineering, building tokens that map to CSS variables, deciding what becomes a component and what does not, and writing the handoff notes that stop the three-day back-and-forth.\n\nThis is a working session, not a slideshow. I share my screen for forty minutes and build in front of you, then twenty minutes for your questions — including on your own files if you want to paste a link.',
    whoFor:
      'Designers with 1–5 years of experience who hand files to developers and keep getting things back wrong. Useful for frontend engineers on the receiving end too.',
    prerequisites:
      'A free Figma account. You do not need to install anything or write any code during the session.',
    language: 'English, with Tamil and Hindi for questions',
    recommendedDevice:
      'A laptop or iPad. Phone works for watching but the screen share will be hard to read.',
    agenda: [
      { at: '0–10 min', label: 'What actually breaks in handoff, with three real examples' },
      { at: '10–30 min', label: 'Structuring one screen: layers, auto-layout, variants' },
      { at: '30–40 min', label: 'Tokens to CSS variables, live' },
      { at: '40–60 min', label: 'Your questions — text or unmute' },
    ],
    pricePaise: 49_900,
    startsAt: at(6, 19),
    seatsTaken: 14,
    maxSeats: SEATS.MAX,
    minSeats: SEATS.MIN_TO_RUN,
    status: 'PUBLISHED',
    tutor,
  },
  {
    slug: 'design-tokens-that-survive',
    title: 'Design tokens that survive a real codebase',
    summary:
      'Why most token systems collapse in month three, and how to structure one that does not.',
    description:
      'A short, opinionated session on token architecture: naming layers, semantic versus primitive, theming without a rewrite, and the mistakes that force a migration later.',
    whoFor: 'Designers and engineers who own or are about to build a token system.',
    prerequisites: 'Some exposure to Figma variables or CSS custom properties.',
    language: 'English',
    recommendedDevice: 'Laptop recommended.',
    agenda: [
      { at: '0–15 min', label: 'The three-layer model' },
      { at: '15–40 min', label: 'Building it live in Figma and code' },
      { at: '40–60 min', label: 'Q&A' },
    ],
    pricePaise: 79_900,
    startsAt: at(13, 20),
    seatsTaken: 3,
    maxSeats: SEATS.MAX,
    minSeats: SEATS.MIN_TO_RUN,
    status: 'PUBLISHED',
    tutor,
  },
  {
    slug: 'accessible-components-free',
    title: 'Accessible components: the five things that matter most',
    summary: 'A free intro session. Focus, labels, contrast, motion, and keyboard order.',
    description:
      'The shortest useful version of accessibility for people who build interfaces. Free, because everyone should have this.',
    whoFor: 'Anyone who builds or designs UI.',
    prerequisites: 'None.',
    language: 'English',
    recommendedDevice: 'Any device.',
    agenda: [
      { at: '0–40 min', label: 'The five things, with live fixes' },
      { at: '40–60 min', label: 'Q&A' },
    ],
    pricePaise: 0,
    startsAt: at(2, 18, 30),
    seatsTaken: 20,
    maxSeats: SEATS.MAX,
    minSeats: SEATS.MIN_TO_RUN,
    status: 'PUBLISHED',
    tutor: secondTutor,
  },
  {
    slug: 'prototyping-for-handoff',
    title: 'Prototyping just enough to explain the interaction',
    summary: 'Not a portfolio prototype — the smallest thing that answers an engineer’s question.',
    description: 'Under-filled and moved a week. Buyers were asked to confirm or refund.',
    whoFor: 'Designers who over-build prototypes.',
    prerequisites: 'Figma account.',
    language: 'English',
    recommendedDevice: 'Laptop.',
    agenda: [{ at: '0–60 min', label: 'Working session' }],
    pricePaise: 49_900,
    startsAt: at(9, 19),
    seatsTaken: 3,
    maxSeats: SEATS.MAX,
    minSeats: SEATS.MIN_TO_RUN,
    status: 'DEFERRED',
    tutor,
  },
  {
    slug: 'critique-that-works',
    title: 'Running a design critique people do not dread',
    summary: 'Structure, roles, and how to get useful feedback instead of opinions.',
    description: 'Completed last week.',
    whoFor: 'Design leads.',
    prerequisites: 'None.',
    language: 'English',
    recommendedDevice: 'Any device.',
    agenda: [{ at: '0–60 min', label: 'Session' }],
    pricePaise: 49_900,
    startsAt: at(-5, 19),
    seatsTaken: 18,
    maxSeats: SEATS.MAX,
    minSeats: SEATS.MIN_TO_RUN,
    status: 'COMPLETED',
    tutor,
  },
]

export function getWorkshops(): MockWorkshop[] {
  return workshops.filter((w) => w.status === 'PUBLISHED')
}

export function getWorkshop(slug: string): MockWorkshop | undefined {
  return workshops.find((w) => w.slug === slug)
}

export const featured = workshops[0]

// ---------------------------------------------------------------------------
// A learner's own view
// ---------------------------------------------------------------------------

export type MockBooking = {
  reference: string
  workshop: MockWorkshop
  seatNumber: number
  status: 'CONFIRMED' | 'ATTENDED' | 'MISSED' | 'REFUNDED' | 'AWAITING_CONFIRMATION'
  attendanceConfirmed: boolean
  minutesPresent?: number
  certificateCode?: string
  recordingAvailable: boolean
  joinToken: string
}

export const bookings: MockBooking[] = [
  {
    reference: 'SKD-8F2A41',
    workshop: workshops[0],
    seatNumber: 7,
    status: 'CONFIRMED',
    attendanceConfirmed: false,
    recordingAvailable: false,
    joinToken: 'demo-upcoming',
  },
  {
    reference: 'SKD-3C90B7',
    workshop: workshops[3],
    seatNumber: 2,
    status: 'AWAITING_CONFIRMATION',
    attendanceConfirmed: false,
    recordingAvailable: false,
    joinToken: 'demo-deferred',
  },
  {
    reference: 'SKD-1B7E22',
    workshop: workshops[4],
    seatNumber: 11,
    status: 'ATTENDED',
    attendanceConfirmed: true,
    minutesPresent: 57,
    certificateCode: 'SKD-4K7P-92MX',
    recordingAvailable: true,
    joinToken: 'demo-past',
  },
]

export function getBooking(token: string): MockBooking {
  return bookings.find((b) => b.joinToken === token) ?? bookings[0]
}

// ---------------------------------------------------------------------------
// Live session
// ---------------------------------------------------------------------------

export type MockQuestion = {
  id: string
  from: string
  body: string
  upvotes: number
  answered: boolean
  answerBody?: string
}

export const questions: MockQuestion[] = [
  {
    id: 'q1',
    from: 'Priya',
    body: 'How do you name tokens when the same colour means two different things in two products?',
    upvotes: 11,
    answered: false,
  },
  {
    id: 'q2',
    from: 'Arun',
    body: 'Do you keep spacing as a token or just use a scale in code?',
    upvotes: 7,
    answered: false,
  },
  {
    id: 'q3',
    from: 'Fatima',
    body: 'Our engineers never open Figma. What do you actually put in the handoff note?',
    upvotes: 6,
    answered: true,
    answerBody:
      'Three things only: what changed, what is a component versus a one-off, and the states that are not drawn. Anything longer does not get read.',
  },
  { id: 'q4', from: 'Rahul', body: 'Is variant explosion ever worth it?', upvotes: 2, answered: false },
]

export type MockAttendee = {
  seatNumber: number
  /** Names and counts only. Tutors never see learner email addresses. */
  name: string
  status: 'PRESENT' | 'JOINED_LATE' | 'DROPPED' | 'NOT_JOINED'
  minutesPresent: number
  confirmedAttending: boolean
  handRaised?: boolean
}

export const attendees: MockAttendee[] = [
  { seatNumber: 1, name: 'Priya R', status: 'PRESENT', minutesPresent: 58, confirmedAttending: true },
  { seatNumber: 2, name: 'Arun Kumar', status: 'PRESENT', minutesPresent: 60, confirmedAttending: true, handRaised: true },
  { seatNumber: 3, name: 'Fatima N', status: 'PRESENT', minutesPresent: 55, confirmedAttending: true },
  { seatNumber: 4, name: 'Rahul Desai', status: 'JOINED_LATE', minutesPresent: 38, confirmedAttending: false },
  { seatNumber: 5, name: 'Sneha M', status: 'PRESENT', minutesPresent: 60, confirmedAttending: true, handRaised: true },
  { seatNumber: 6, name: 'Vikram S', status: 'DROPPED', minutesPresent: 21, confirmedAttending: true },
  { seatNumber: 7, name: 'Anjali T', status: 'PRESENT', minutesPresent: 59, confirmedAttending: true },
  { seatNumber: 8, name: 'Karthik V', status: 'NOT_JOINED', minutesPresent: 0, confirmedAttending: false },
  { seatNumber: 9, name: 'Divya P', status: 'PRESENT', minutesPresent: 57, confirmedAttending: true },
  { seatNumber: 10, name: 'Mohit Jain', status: 'PRESENT', minutesPresent: 52, confirmedAttending: true },
  { seatNumber: 11, name: 'Lakshmi A', status: 'PRESENT', minutesPresent: 60, confirmedAttending: true },
  { seatNumber: 12, name: 'Imran Q', status: 'NOT_JOINED', minutesPresent: 0, confirmedAttending: false },
  { seatNumber: 13, name: 'Nisha B', status: 'PRESENT', minutesPresent: 44, confirmedAttending: true },
  { seatNumber: 14, name: 'Gautam R', status: 'PRESENT', minutesPresent: 60, confirmedAttending: true },
]

export const chatMessages = [
  { id: 'c1', from: 'Sathish S', fromTutor: true, body: 'Welcome in — we start at 7:00 sharp. Mics are off by default.', at: '18:52' },
  { id: 'c2', from: 'Priya R', fromTutor: false, body: 'Excited for this one 🙌', at: '18:54' },
  { id: 'c3', from: 'Arun Kumar', fromTutor: false, body: 'Audio is clear here', at: '18:58' },
  {
    id: 'c4',
    from: 'Sathish S',
    fromTutor: true,
    body: 'Resources from today are attached below — the Figma file is view-only, duplicate it to follow along.',
    at: '20:04',
  },
]

// ---------------------------------------------------------------------------
// Certificate
// ---------------------------------------------------------------------------

export const certificate = {
  code: 'SKD-4K7P-92MX',
  learnerName: 'Priya Ramanathan',
  workshopTitle: 'Running a design critique people do not dread',
  tutorName: 'Sathish S',
  tutorCredential: 'Lead Product Designer, ESDS',
  sessionDate: at(-5, 19),
  minutesPresent: 57,
  totalMinutes: SESSION.TOTAL_MINUTES,
}

// ---------------------------------------------------------------------------
// Tutor dashboard
// ---------------------------------------------------------------------------

export const tutorStats = {
  upcomingSessions: 2,
  seatsSoldThisMonth: 31,
  grossThisMonthPaise: 1_547_000,
  heldPaise: 398_400,
  averageAttendance: 84,
  averageRating: 4.7,
}
