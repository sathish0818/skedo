import type { ReactNode } from 'react'
import { CERTIFICATE, RECORDING, SESSION } from '@/lib/rules'

/**
 * The nine messages. Email uses inline styles and a table-free single column,
 * which is what survives Gmail and Outlook. WhatsApp messages are plain text —
 * every one of them has to be approved as a Meta template before it can send, so
 * variables are marked {{like_this}} to match what gets submitted.
 *
 * These are shown side by side at /dev/messages for review.
 */

const ink = '#16201c'
const inkSoft = '#56635d'
const brand = '#1b4d3e'
const line = '#e2ded5'

export function EmailShell({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <div style={{ background: '#faf9f6', padding: '24px 16px', fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div style={{ display: 'none', overflow: 'hidden', maxHeight: 0, opacity: 0 }}>{preview}</div>
      <div style={{ maxWidth: 520, margin: '0 auto', background: '#ffffff', border: `1px solid ${line}`, borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: `1px solid ${line}` }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: ink, letterSpacing: '-0.01em' }}>Skedo</span>
        </div>
        <div style={{ padding: '24px', color: ink, fontSize: 15, lineHeight: 1.55 }}>{children}</div>
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${line}`, color: '#8b968f', fontSize: 12 }}>
          Skedo · one-hour live workshops · <a href="#" style={{ color: '#8b968f' }}>Manage your bookings</a>
        </div>
      </div>
    </div>
  )
}

function CTA({ label }: { label: string }) {
  return (
    <a
      href="#"
      style={{
        display: 'inline-block',
        background: brand,
        color: '#ffffff',
        textDecoration: 'none',
        padding: '11px 20px',
        borderRadius: 8,
        fontSize: 15,
        fontWeight: 500,
        margin: '8px 0',
      }}
    >
      {label}
    </a>
  )
}

function Meta({ rows }: { rows: [string, string][] }) {
  return (
    <div style={{ border: `1px solid ${line}`, borderRadius: 8, padding: '12px 14px', margin: '16px 0' }}>
      {rows.map(([label, value]) => (
        <p key={label} style={{ margin: '4px 0', fontSize: 14, color: inkSoft }}>
          <strong style={{ color: ink }}>{label}:</strong> {value}
        </p>
      ))}
    </div>
  )
}

export type Message = {
  id: string
  name: string
  channel: 'EMAIL' | 'WHATSAPP'
  subject?: string
  when: string
  body: ReactNode
}

const workshop = 'Figma to production, without the handoff mess'
const slot = 'Saturday 13 September, 7:00 PM IST'

export const MESSAGES: Message[] = [
  {
    id: 'M1',
    name: 'Booking confirmation',
    channel: 'EMAIL',
    subject: `You're in — ${workshop}`,
    when: 'Immediately after the payment webhook confirms',
    body: (
      <EmailShell preview={`Seat 7 confirmed for ${slot}`}>
        <h1 style={{ margin: '0 0 8px', fontSize: 22, color: ink }}>Seat 7 is yours</h1>
        <p style={{ margin: '0 0 4px', color: inkSoft }}>
          You are booked for <strong style={{ color: ink }}>{workshop}</strong> with Sathish S.
        </p>
        <Meta
          rows={[
            ['When', slot],
            ['Where', 'In your browser — no app to install'],
            ['Reference', 'SKD-8F2A41'],
          ]}
        />
        <CTA label="Open your join page" />
        <p style={{ margin: '12px 0 0', fontSize: 14, color: inkSoft }}>
          This link is yours alone and works on one device at a time. Calendar invite attached.
        </p>
        <p style={{ margin: '16px 0 0', fontSize: 14, color: inkSoft }}>
          Can&rsquo;t make it? Cancel for a full refund up to 24 hours before. Either way you get the
          recording for {RECORDING.ACCESS_DAYS} days — the certificate needs{' '}
          {CERTIFICATE.THRESHOLD_MINUTES} of the {SESSION.TOTAL_MINUTES} minutes live.
        </p>
      </EmailShell>
    ),
  },
  {
    id: 'M2',
    name: 'Reminder — 24 hours',
    channel: 'WHATSAPP',
    when: 'T−24h · the single biggest no-show reducer',
    body: (
      <>
        Hi {'{{name}}'} 👋{'\n\n'}
        Your workshop <b>{'{{workshop_title}}'}</b> is tomorrow at {'{{time}}'} IST.{'\n\n'}
        Are you coming? Tap to confirm — it takes one second and helps {'{{tutor_name}}'} plan the
        session.{'\n\n'}
        ✅ Yes, I&rsquo;ll be there{'\n'}
        ❌ Cancel my seat (full refund){'\n\n'}
        {'{{join_link}}'}
      </>
    ),
  },
  {
    id: 'M3',
    name: 'Reminder — 1 hour',
    channel: 'WHATSAPP',
    when: 'T−1h',
    body: (
      <>
        {'{{workshop_title}}'} starts in an hour, at {'{{time}}'} IST.{'\n\n'}
        A laptop or iPad works best — the shared screen has fine detail.{'\n\n'}
        Join here: {'{{join_link}}'}
      </>
    ),
  },
  {
    id: 'M4',
    name: 'Reminder — 10 minutes',
    channel: 'WHATSAPP',
    when: 'T−10min · doors are already open',
    body: (
      <>
        Starting in 10 minutes. Doors are open — join now and check your audio.{'\n\n'}
        {'{{join_link}}'}
      </>
    ),
  },
  {
    id: 'M5',
    name: 'Session moved a week',
    channel: 'EMAIL',
    subject: `New date for ${workshop} — confirm or take a refund`,
    when: 'When fewer than the minimum seats sell',
    body: (
      <EmailShell preview="Your session moved by a week. Confirm or refund.">
        <h1 style={{ margin: '0 0 8px', fontSize: 22, color: ink }}>This session moved by a week</h1>
        <p style={{ margin: '0 0 4px', color: inkSoft }}>
          Only 3 of the 5 seats needed were booked, so <strong style={{ color: ink }}>{workshop}</strong>{' '}
          now runs a week later.
        </p>
        <Meta
          rows={[
            ['New date', 'Saturday 20 September, 7:00 PM IST'],
            ['Your seat', 'Seat 2 — still held'],
          ]}
        />
        <p style={{ margin: '0 0 8px', color: inkSoft }}>
          You did not agree to this date, so it is entirely your call:
        </p>
        <CTA label="Confirm the new date" />
        <p style={{ margin: '8px 0 0', fontSize: 14 }}>
          <a href="#" style={{ color: brand }}>Or take a full refund →</a>
        </p>
        <p style={{ margin: '16px 0 0', fontSize: 14, color: inkSoft }}>
          If it does not fill by the new date, every seat is refunded automatically — no action needed
          from you.
        </p>
      </EmailShell>
    ),
  },
  {
    id: 'M6',
    name: 'Refund confirmed',
    channel: 'EMAIL',
    subject: 'Your refund is on the way',
    when: 'When a refund is initiated, for any reason',
    body: (
      <EmailShell preview="₹499 refunded to your UPI account">
        <h1 style={{ margin: '0 0 8px', fontSize: 22, color: ink }}>₹499 is on the way back</h1>
        <p style={{ margin: '0 0 4px', color: inkSoft }}>
          We have refunded your seat for <strong style={{ color: ink }}>{workshop}</strong>.
        </p>
        <Meta
          rows={[
            ['Amount', '₹499'],
            ['Back to', 'The UPI account you paid from'],
            ['Expect it', 'Within 5–7 working days'],
            ['Reference', 'SKD-8F2A41'],
          ]}
        />
        <p style={{ margin: 0, fontSize: 14, color: inkSoft }}>
          Banks control the timing once we release it. If it has not arrived in a week, reply to this
          email and a human will chase it.
        </p>
      </EmailShell>
    ),
  },
  {
    id: 'M7',
    name: 'Certificate issued',
    channel: 'EMAIL',
    subject: `Your certificate — ${workshop}`,
    when: 'After attendance is computed, for learners above the threshold',
    body: (
      <EmailShell preview="You attended 57 of 60 minutes. Certificate attached.">
        <h1 style={{ margin: '0 0 8px', fontSize: 22, color: ink }}>You earned your certificate</h1>
        <p style={{ margin: '0 0 4px', color: inkSoft }}>
          You were present for 57 of the {SESSION.TOTAL_MINUTES} minutes — comfortably above the{' '}
          {CERTIFICATE.THRESHOLD_MINUTES} needed.
        </p>
        <Meta
          rows={[
            ['Workshop', workshop],
            ['Led by', 'Sathish S, Lead Product Designer'],
            ['Verify at', 'skedo.in/verify/SKD-4K7P-92MX'],
          ]}
        />
        <CTA label="View and download" />
        <p style={{ margin: '12px 0 0', fontSize: 14, color: inkSoft }}>
          Anyone can check that link to confirm it is genuine — which is what makes it worth putting on
          LinkedIn.
        </p>
      </EmailShell>
    ),
  },
  {
    id: 'M8',
    name: 'Recording ready',
    channel: 'EMAIL',
    subject: 'The recording is ready',
    when: 'When processing finishes — to everyone who paid, attended or not',
    body: (
      <EmailShell preview={`Yours for ${RECORDING.ACCESS_DAYS} days`}>
        <h1 style={{ margin: '0 0 8px', fontSize: 22, color: ink }}>The recording is up</h1>
        <p style={{ margin: '0 0 4px', color: inkSoft }}>
          The full hour of <strong style={{ color: ink }}>{workshop}</strong> is ready to watch, with
          chapters.
        </p>
        <CTA label="Watch the recording" />
        <p style={{ margin: '12px 0 0', fontSize: 14, color: inkSoft }}>
          Yours for {RECORDING.ACCESS_DAYS} days. It is tied to your account and watermarked with your
          email, so please don&rsquo;t share it — {'{{tutor_name}}'} makes their living from this.
        </p>
        <p style={{ margin: '16px 0 0', fontSize: 14, color: inkSoft }}>
          Questions the Q&amp;A ran out of time for have been answered in the workshop chat.
        </p>
      </EmailShell>
    ),
  },
  {
    id: 'M9',
    name: 'Payout sent',
    channel: 'EMAIL',
    subject: 'Your payout for Saturday’s session',
    when: `T+2 after the session, once attendance is final`,
    body: (
      <EmailShell preview="₹5,891 released to your account">
        <h1 style={{ margin: '0 0 8px', fontSize: 22, color: ink }}>₹5,891 is on its way</h1>
        <p style={{ margin: '0 0 4px', color: inkSoft }}>
          Your payout for <strong style={{ color: ink }}>{workshop}</strong> has been released.
        </p>
        <Meta
          rows={[
            ['14 seats × ₹499', '₹6,986'],
            ['Skedo commission (20%)', '− ₹1,397'],
            ['TDS 194-O (1%)', '− ₹70'],
            ['Paid to you', '₹5,519'],
          ]}
        />
        <p style={{ margin: 0, fontSize: 14, color: inkSoft }}>
          14 of 14 learners joined and 12 earned certificates. No other deductions — the statement is in
          your dashboard.
        </p>
      </EmailShell>
    ),
  },
]
