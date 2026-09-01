'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from './ui'

/**
 * Real camera, microphone and network checks.
 *
 * Nothing here streams to anyone — that needs a media server (100ms/Dyte/
 * LiveKit) and is a separate piece of work. This is the local half: does your
 * camera work, is your mic picking anything up, is your connection good enough.
 * It runs entirely in the browser with no account and no cost.
 *
 * Two things that bite in practice and are handled explicitly below:
 *  - Camera and mic need a secure context. `localhost` counts; opening the dev
 *    server over a LAN IP on your phone does not, and the browser gives no
 *    permission prompt at all — so we say so rather than looking broken.
 *  - Tracks must be stopped on unmount or the camera light stays on after the
 *    user has navigated away.
 */

export type MediaStatus = 'idle' | 'requesting' | 'ready' | 'denied' | 'missing' | 'busy' | 'insecure'

export function statusMessage(status: MediaStatus, kind: 'camera' | 'microphone'): string {
  switch (status) {
    case 'denied':
      return `Access to your ${kind} was blocked. Allow it in your browser's address-bar icon, then try again.`
    case 'missing':
      return `No ${kind} found on this device.`
    case 'busy':
      return `Your ${kind} is already in use by another app. Close Zoom, Meet or Teams and try again.`
    case 'insecure':
      return `Browsers only allow ${kind} access over HTTPS or on localhost. Open this page on localhost or the deployed URL.`
    default:
      return ''
  }
}

function classifyError(error: unknown): MediaStatus {
  const name = (error as { name?: string })?.name
  if (name === 'NotAllowedError' || name === 'SecurityError') return 'denied'
  if (name === 'NotFoundError' || name === 'OverconstrainedError') return 'missing'
  if (name === 'NotReadableError' || name === 'AbortError') return 'busy'
  return 'denied'
}

type UseMediaOptions = { video?: boolean; audio?: boolean }

export function useMedia({ video = false, audio = false }: UseMediaOptions) {
  const [status, setStatus] = useState<MediaStatus>('idle')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setStream(null)
    setStatus('idle')
  }, [])

  const start = useCallback(
    async (constraints?: { videoDeviceId?: string; audioDeviceId?: string }) => {
      if (typeof window === 'undefined') return
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        setStatus('insecure')
        return
      }

      // Replacing an existing stream: release the old tracks first, or the
      // camera stays held and the new request fails with NotReadableError.
      streamRef.current?.getTracks().forEach((track) => track.stop())
      setStatus('requesting')

      try {
        const next = await navigator.mediaDevices.getUserMedia({
          video: video
            ? constraints?.videoDeviceId
              ? { deviceId: { exact: constraints.videoDeviceId } }
              : { width: { ideal: 1280 }, height: { ideal: 720 } }
            : false,
          audio: audio
            ? constraints?.audioDeviceId
              ? { deviceId: { exact: constraints.audioDeviceId } }
              : true
            : false,
        })
        streamRef.current = next
        setStream(next)
        setStatus('ready')

        // Labels are empty until permission is granted, so enumerate after.
        setDevices(await navigator.mediaDevices.enumerateDevices())
      } catch (error) {
        setStatus(classifyError(error))
      }
    },
    [video, audio],
  )

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
  }, [])

  return {
    status,
    stream,
    start,
    stop,
    cameras: devices.filter((d) => d.kind === 'videoinput'),
    microphones: devices.filter((d) => d.kind === 'audioinput'),
  }
}

export function VideoPreview({
  stream,
  mirrored = true,
  className,
}: {
  stream: MediaStream | null
  mirrored?: boolean
  className?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.srcObject = stream
    if (stream) void el.play().catch(() => {})
  }, [stream])

  return (
    <video
      ref={ref}
      playsInline
      muted
      className={cn('size-full object-cover', mirrored && 'scale-x-[-1]', className)}
    />
  )
}

/** Live input level from the actual microphone. Proves the mic works far better than a green tick. */
export function MicMeter({ stream }: { stream: MediaStream | null }) {
  const [level, setLevel] = useState(0)
  const [peak, setPeak] = useState(0)

  useEffect(() => {
    if (!stream || stream.getAudioTracks().length === 0) {
      setLevel(0)
      return
    }

    const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const context = new AudioCtx()
    const source = context.createMediaStreamSource(stream)
    const analyser = context.createAnalyser()
    analyser.fftSize = 512
    source.connect(analyser)

    const buffer = new Uint8Array(analyser.frequencyBinCount)
    let frame = 0

    const tick = () => {
      analyser.getByteTimeDomainData(buffer)
      // RMS around the 128 midpoint, scaled to something that looks like a meter.
      let sum = 0
      for (const sample of buffer) {
        const centred = (sample - 128) / 128
        sum += centred * centred
      }
      const rms = Math.sqrt(sum / buffer.length)
      const next = Math.min(100, Math.round(rms * 320))
      setLevel(next)
      setPeak((p) => Math.max(p * 0.97, next))
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      source.disconnect()
      void context.close()
    }
  }, [stream])

  const bars = 16
  const lit = Math.round((level / 100) * bars)

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 gap-[3px]" role="img" aria-label={`Microphone level ${level} percent`}>
        {Array.from({ length: bars }, (_, i) => (
          <span
            key={i}
            className={cn(
              'h-4 flex-1 rounded-[2px] transition-colors duration-75',
              i < lit ? (i > bars - 4 ? 'bg-accent' : 'bg-brand') : 'bg-surface-3',
            )}
          />
        ))}
      </div>
      <span className="w-16 shrink-0 text-right text-xs text-ink-faint tabular">
        {peak < 2 ? 'silent' : `${level}%`}
      </span>
    </div>
  )
}

export type NetworkResult = {
  medianMs: number
  jitterMs: number
  downlinkMbps?: number
  verdict: 'good' | 'ok' | 'weak'
}

/**
 * Latency and jitter, not raw bandwidth — a stable 3 Mbps line carries a
 * screen share far better than a 50 Mbps one that stalls every few seconds,
 * and jitter is what actually breaks audio.
 */
export async function measureNetwork(): Promise<NetworkResult> {
  const samples: number[] = []
  for (let i = 0; i < 6; i++) {
    const started = performance.now()
    try {
      await fetch(`/api/ping?i=${i}-${Math.random()}`, { cache: 'no-store' })
      samples.push(performance.now() - started)
    } catch {
      // Ignore a failed sample; a single dropped probe should not fail the check.
    }
  }

  if (samples.length === 0) {
    return { medianMs: 0, jitterMs: 0, verdict: 'weak' }
  }

  const sorted = [...samples].sort((a, b) => a - b)
  const medianMs = Math.round(sorted[Math.floor(sorted.length / 2)])
  const jitterMs = Math.round(sorted[sorted.length - 1] - sorted[0])

  const connection = (navigator as unknown as { connection?: { downlink?: number } }).connection
  const downlinkMbps = connection?.downlink

  const verdict: NetworkResult['verdict'] =
    medianMs < 120 && jitterMs < 90 ? 'good' : medianMs < 350 && jitterMs < 250 ? 'ok' : 'weak'

  return { medianMs, jitterMs, downlinkMbps, verdict }
}
