'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Badge, Button, Input, cn } from './ui'
import { clock } from '@/lib/format'
import { SESSION } from '@/lib/rules'
import type { MockQuestion } from '@/lib/mock'

type Props = {
  title: string
  tutorName: string
  learnerEmail: string
  seatNumber: number
  initialQuestions: MockQuestion[]
  chat: { id: string; from: string; fromTutor: boolean; body: string; at: string }[]
  /** Host view swaps the learner controls for the tutor's. */
  host?: boolean
  attendeeCount?: number
  handsRaised?: number
}

/**
 * Screens 07 and 20 — the live room, learner and host views.
 *
 * Layout is the hard part on phones: a shared screen is unreadable in portrait,
 * so the room asks for landscape and puts chat in a slide-up sheet rather than a
 * side panel that would eat half the stage.
 */
export function LiveRoom({
  title,
  tutorName,
  learnerEmail,
  seatNumber,
  initialQuestions,
  chat,
  host = false,
  attendeeCount = 14,
  handsRaised = 2,
}: Props) {
  // Starts near the demo/Q&A boundary so both phases are visible in a demo.
  const [elapsed, setElapsed] = useState(SESSION.DEMO_MINUTES * 60 - 95)
  const [panelOpen, setPanelOpen] = useState(false)
  const [tab, setTab] = useState<'questions' | 'chat'>('questions')
  const [handUp, setHandUp] = useState(false)
  const [audioOnly, setAudioOnly] = useState(false)
  const [questions, setQuestions] = useState(initialQuestions)

  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const inQa = elapsed >= SESSION.DEMO_MINUTES * 60
  const phaseLabel = inQa ? 'Questions' : 'Demo'
  const phaseRemaining = inQa
    ? SESSION.TOTAL_MINUTES * 60 - elapsed
    : SESSION.DEMO_MINUTES * 60 - elapsed

  const upvote = (id: string) =>
    setQuestions((qs) =>
      [...qs.map((q) => (q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q))].sort(
        (a, b) => b.upvotes - a.upvotes,
      ),
    )

  return (
    <div className="flex h-dvh flex-col bg-ink text-surface">
      <header className="pt-safe flex shrink-0 items-center gap-3 border-b border-surface/10 px-3 py-2 sm:px-4">
        <Badge tone="live" className="bg-live/20 text-surface">
          Live
        </Badge>
        <p className="min-w-0 flex-1 truncate text-sm font-medium">{title}</p>
        <div className="flex shrink-0 items-center gap-3 text-xs">
          <span className="hidden sm:inline text-surface/60">{phaseLabel}</span>
          <span className="rounded bg-surface/10 px-2 py-1 font-mono tabular">
            {clock(phaseRemaining)}
          </span>
          {host && (
            <span className="hidden sm:inline text-surface/60">
              {attendeeCount} present · {handsRaised} hands
            </span>
          )}
        </div>
      </header>

      {/* Phase progress — 40 minutes of demo, then 20 of questions. */}
      <div className="flex h-0.5 shrink-0">
        <div
          className="bg-brand transition-[width] duration-1000"
          style={{ width: `${Math.min(100, (elapsed / (SESSION.TOTAL_MINUTES * 60)) * 100)}%` }}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <main className="relative flex min-h-0 flex-1 flex-col">
          <div className="relative flex flex-1 items-center justify-center bg-black/40">
            {audioOnly ? (
              <div className="flex flex-col items-center gap-2 text-surface/60">
                <span className="flex size-14 items-center justify-center rounded-full border border-surface/20">
                  ♪
                </span>
                <p className="text-sm">Audio only — saving data</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-surface/40">
                <p className="font-mono text-xs uppercase tracking-widest">Shared screen</p>
                <p className="text-sm">{tutorName} is presenting</p>
              </div>
            )}

            {/* Watermarked with the viewer's own email. Traceable, not preventive. */}
            <p
              aria-hidden
              className="pointer-events-none absolute top-3 right-3 rounded bg-black/40 px-2 py-1 font-mono text-[0.6rem] text-surface/50"
            >
              {learnerEmail}
            </p>

            <div className="absolute right-3 bottom-3 flex h-20 w-28 items-center justify-center rounded-card border border-surface/15 bg-surface/10 text-xs text-surface/60 sm:h-24 sm:w-36">
              {tutorName.split(' ')[0]}
            </div>

            {/* Portrait phones only: the shared screen is unreadable this way. */}
            <p className="absolute inset-x-4 bottom-3 rounded-card bg-black/60 px-3 py-2 text-center text-xs text-surface/80 portrait:block landscape:hidden sm:hidden">
              Rotate your phone for a readable view of the shared screen.
            </p>
          </div>

        </main>

        {/* Side panel on desktop; slide-up sheet on phones. */}
        <aside
          className={cn(
            'flex min-h-0 flex-col border-surface/10 bg-ink lg:w-80 lg:shrink-0 lg:border-l',
            // Below lg the panel is a row of the column layout, not an overlay:
            // covering the control bar would hide Raise hand and Leave.
            panelOpen
              ? 'h-[55dvh] shrink-0 border-t lg:h-auto lg:border-t-0'
              : 'hidden lg:flex',
          )}
        >
          <div className="flex shrink-0 gap-1 border-b border-surface/10 p-2">
            {(['questions', 'chat'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'flex-1 rounded-card px-3 py-1.5 text-sm capitalize transition-colors',
                  tab === t ? 'bg-surface/12 font-medium' : 'text-surface/60 hover:text-surface',
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {tab === 'questions' ? (
              <ul className="flex flex-col gap-2">
                {questions.map((q) => (
                  <li
                    key={q.id}
                    className={cn(
                      'rounded-card border border-surface/10 p-3',
                      q.answered && 'opacity-50',
                    )}
                  >
                    <p className="text-sm">{q.body}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => upvote(q.id)}
                        className="rounded-full bg-surface/10 px-2 py-0.5 text-xs tabular hover:bg-surface/20"
                      >
                        ▲ {q.upvotes}
                      </button>
                      <span className="text-xs text-surface/40">{q.from}</span>
                      {q.answered && <span className="text-xs text-surface/40">answered</span>}
                      {host && !q.answered && (
                        <button className="ml-auto text-xs text-brand">Mark answered</button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="flex flex-col gap-3">
                {chat.map((msg) => (
                  <li key={msg.id} className="text-sm">
                    <span className={cn('font-medium', msg.fromTutor && 'text-brand')}>{msg.from}</span>
                    <span className="ml-2 text-xs text-surface/40 tabular">{msg.at}</span>
                    <p className="text-surface/80">{msg.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form className="flex shrink-0 gap-2 border-t border-surface/10 p-3">
            <Input
              placeholder={tab === 'questions' ? 'Ask a question…' : 'Message everyone…'}
              aria-label={tab === 'questions' ? 'Your question' : 'Your message'}
              className="flex-1 border-surface/20 bg-surface/10 text-surface placeholder:text-surface/40"
            />
            <Button type="submit" size="sm" className="shrink-0">
              Send
            </Button>
          </form>

          {!host && (
            <p className="pb-safe px-3 pb-2 text-[0.68rem] text-surface/40">
              Seat {seatNumber} · unmute requests open in the last {SESSION.QA_MINUTES} minutes
            </p>
          )}
        </aside>
      </div>

        <div className="pb-safe flex shrink-0 items-center gap-2 border-t border-surface/10 px-3 py-2.5">
          {host ? (
            <>
              <Button size="sm" variant="secondary" className="border-surface/20 bg-surface/10 text-surface">
                Share screen
              </Button>
              <Button size="sm" variant="secondary" className="border-surface/20 bg-surface/10 text-surface">
                Mute all
              </Button>
              <Button size="sm" variant="secondary" className="border-surface/20 bg-surface/10 text-surface">
                {handsRaised} hands
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                onClick={() => setHandUp((h) => !h)}
                variant={handUp ? 'primary' : 'secondary'}
                className={cn(!handUp && 'border-surface/20 bg-surface/10 text-surface')}
              >
                {handUp ? 'Hand raised ✓' : 'Raise hand'}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setAudioOnly((a) => !a)}
                className="border-surface/20 bg-surface/10 text-surface"
              >
                {audioOnly ? 'Show video' : 'Audio only'}
              </Button>
            </>
          )}

          <span className="flex-1" />

          <Button
            size="sm"
            variant="secondary"
            onClick={() => setPanelOpen((p) => !p)}
            className="border-surface/20 bg-surface/10 text-surface lg:hidden"
          >
            {panelOpen ? 'Hide' : `Questions ${questions.length}`}
          </Button>

          <Link
            href={host ? '/tutor' : '/join/demo-past/rate'}
            className="rounded-card bg-live/20 px-3 py-1.5 text-sm text-surface"
          >
            Leave
          </Link>
        </div>
    </div>
  )
}
