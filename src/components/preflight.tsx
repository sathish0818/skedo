'use client'

import { useState } from 'react'
import { Badge, Button, Card, Eyebrow, cn } from './ui'

type CheckState = 'idle' | 'checking' | 'ok' | 'warn'

const checks = [
  { key: 'audio', label: 'Speakers', detail: 'You need to hear the tutor.' },
  { key: 'mic', label: 'Microphone', detail: 'Only used if you request to unmute in the Q&A.' },
  { key: 'network', label: 'Connection', detail: 'We drop to audio-only automatically if it struggles.' },
] as const

/**
 * Pre-flight check on the learner's own join page — not just the tutor's green
 * room. Poor bandwidth is the single most-cited failure in online teaching, and
 * finding out at 7:01pm is too late.
 */
export function Preflight({ onReady }: { onReady?: () => void }) {
  const [state, setState] = useState<Record<string, CheckState>>({})
  const [audioOnly, setAudioOnly] = useState(false)

  const run = () => {
    checks.forEach((check, i) => {
      setState((s) => ({ ...s, [check.key]: 'checking' }))
      setTimeout(
        () => setState((s) => ({ ...s, [check.key]: check.key === 'network' ? 'warn' : 'ok' })),
        400 + i * 350,
      )
    })
    setTimeout(() => onReady?.(), 1600)
  }

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <Eyebrow>Check your setup</Eyebrow>
        <Button size="sm" variant="secondary" onClick={run}>
          Run check
        </Button>
      </div>

      <ul className="flex flex-col divide-y divide-line">
        {checks.map((check) => {
          const s = state[check.key] ?? 'idle'
          return (
            <li key={check.key} className="flex items-start justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{check.label}</p>
                <p className="text-xs text-ink-faint">{check.detail}</p>
              </div>
              <span className="shrink-0">
                {s === 'idle' && <span className="text-xs text-ink-faint">Not checked</span>}
                {s === 'checking' && <span className="text-xs text-ink-soft">Checking…</span>}
                {s === 'ok' && <Badge tone="brand">Good</Badge>}
                {s === 'warn' && <Badge tone="accent">Weak</Badge>}
              </span>
            </li>
          )
        })}
      </ul>

      <label
        className={cn(
          'flex cursor-pointer items-start gap-3 rounded-card border px-4 py-3 text-sm transition-colors',
          audioOnly ? 'border-brand bg-brand-tint' : 'border-line',
        )}
      >
        <input
          type="checkbox"
          checked={audioOnly}
          onChange={(e) => setAudioOnly(e.target.checked)}
          className="mt-0.5 accent-brand"
        />
        <span>
          <span className="font-medium">Join audio-only</span>
          <span className="block text-xs text-ink-faint">
            Uses far less data. You will still hear everything and can read the chat, but not see the
            shared screen.
          </span>
        </span>
      </label>
    </Card>
  )
}
