'use client'

import { useEffect, useState } from 'react'
import { Badge, Button, Card, Eyebrow, Select, cn } from './ui'
import { MicMeter, measureNetwork, statusMessage, useMedia, type NetworkResult } from './media'

/**
 * Pre-flight check on the learner's own join page — not just the tutor's green
 * room. Poor bandwidth is the most-cited failure in online teaching, and finding
 * out at 7:01pm is too late.
 *
 * These are real checks: the microphone meter moves when you speak, the speaker
 * test plays an actual tone, and the connection result is measured round-trip
 * latency and jitter against this server.
 */
export function Preflight({ onReady }: { onReady?: () => void }) {
  const mic = useMedia({ audio: true })
  const [network, setNetwork] = useState<NetworkResult | 'checking' | null>(null)
  const [tonePlaying, setTonePlaying] = useState(false)
  const [heardTone, setHeardTone] = useState<boolean | null>(null)
  const [audioOnly, setAudioOnly] = useState(false)
  const [selectedMic, setSelectedMic] = useState('')

  const checkNetwork = async () => {
    setNetwork('checking')
    setNetwork(await measureNetwork())
  }

  useEffect(() => {
    if (mic.status === 'ready' && network === null) void checkNetwork()
  }, [mic.status, network])

  useEffect(() => {
    if (mic.status === 'ready' && network && network !== 'checking') onReady?.()
  }, [mic.status, network, onReady])

  const playTone = () => {
    const AudioCtx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const context = new AudioCtx()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.frequency.value = 440
    gain.gain.value = 0.12
    oscillator.connect(gain).connect(context.destination)
    oscillator.start()
    setTonePlaying(true)
    setTimeout(() => {
      oscillator.stop()
      void context.close()
      setTonePlaying(false)
    }, 900)
  }

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Eyebrow>Check your setup</Eyebrow>
        {mic.status === 'idle' && (
          <Button size="sm" onClick={() => void mic.start()}>
            Start check
          </Button>
        )}
        {mic.status === 'requesting' && <span className="text-xs text-ink-soft">Waiting for permission…</span>}
        {mic.status === 'ready' && <Badge tone="brand">Mic live</Badge>}
      </div>

      {['denied', 'missing', 'busy', 'insecure'].includes(mic.status) && (
        <div className="rounded-card border border-accent/30 bg-accent-tint px-4 py-3 text-sm">
          <p>{statusMessage(mic.status, 'microphone')}</p>
          <Button size="sm" variant="secondary" className="mt-3" onClick={() => void mic.start()}>
            Try again
          </Button>
        </div>
      )}

      {/* Microphone */}
      <div className="flex flex-col gap-2 border-t border-line pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-medium">Microphone</p>
          <p className="text-xs text-ink-faint">Only used if you request to unmute</p>
        </div>
        {mic.status === 'ready' ? (
          <>
            <MicMeter stream={mic.stream} />
            <p className="text-xs text-ink-faint">Say something — the bars should move.</p>
            {mic.microphones.length > 1 && (
              <Select
                value={selectedMic}
                onChange={(e) => {
                  setSelectedMic(e.target.value)
                  void mic.start({ audioDeviceId: e.target.value })
                }}
                className="mt-1"
              >
                <option value="">Default microphone</option>
                {mic.microphones.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || 'Microphone'}
                  </option>
                ))}
              </Select>
            )}
          </>
        ) : (
          <div className="flex gap-[3px]">
            {Array.from({ length: 16 }, (_, i) => (
              <span key={i} className="h-4 flex-1 rounded-[2px] bg-surface-3" />
            ))}
          </div>
        )}
      </div>

      {/* Speakers */}
      <div className="flex flex-col gap-2 border-t border-line pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-medium">Speakers</p>
            <p className="text-xs text-ink-faint">You need to hear the tutor.</p>
          </div>
          <Button size="sm" variant="secondary" onClick={playTone} disabled={tonePlaying}>
            {tonePlaying ? 'Playing…' : 'Play a test tone'}
          </Button>
        </div>
        {heardTone === null ? (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setHeardTone(true)}>
              I heard it
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setHeardTone(false)}>
              I heard nothing
            </Button>
          </div>
        ) : heardTone ? (
          <Badge tone="brand">Speakers working</Badge>
        ) : (
          <p className="text-sm text-accent">
            Check your volume, and that the right output device is selected in your system settings.
          </p>
        )}
      </div>

      {/* Connection */}
      <div className="flex flex-col gap-2 border-t border-line pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-medium">Connection</p>
            <p className="text-xs text-ink-faint">
              Latency and jitter matter more than raw speed — jitter is what breaks audio.
            </p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => void checkNetwork()}>
            {network === 'checking' ? 'Testing…' : 'Test again'}
          </Button>
        </div>
        {network && network !== 'checking' && (
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone={network.verdict === 'good' ? 'brand' : network.verdict === 'ok' ? 'neutral' : 'accent'}>
              {network.verdict === 'good' ? 'Good' : network.verdict === 'ok' ? 'Usable' : 'Weak'}
            </Badge>
            <span className="text-xs text-ink-soft tabular">
              {network.medianMs} ms latency · {network.jitterMs} ms jitter
              {network.downlinkMbps ? ` · ~${network.downlinkMbps} Mbps` : ''}
            </span>
          </div>
        )}
        {network && network !== 'checking' && network.verdict === 'weak' && (
          <p className="text-sm text-accent">
            Join audio-only below, and use a laptop on Wi-Fi rather than mobile data if you can.
          </p>
        )}
      </div>

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
