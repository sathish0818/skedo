'use client'

import { useState } from 'react'
import { Badge, Button, Card, Eyebrow, Select } from './ui'
import { VideoPreview, statusMessage, useMedia } from './media'

/**
 * The tutor's camera and screen-share check. Real devices, real preview — this
 * is the only camera in Skedo, since learners join with cameras off.
 */
export function CameraCheck() {
  const camera = useMedia({ video: true })
  const [selectedCamera, setSelectedCamera] = useState('')
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null)
  const [screenError, setScreenError] = useState<string | null>(null)

  const testScreenShare = async () => {
    setScreenError(null)
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      setScreenStream(stream)
      // When the user stops sharing from the browser's own bar, reflect it here.
      stream.getVideoTracks()[0]?.addEventListener('ended', () => setScreenStream(null))
    } catch (error) {
      const name = (error as { name?: string })?.name
      setScreenError(
        name === 'NotAllowedError'
          ? 'You cancelled the share, or the browser blocked it.'
          : 'Screen sharing is not available in this browser. Chrome, Edge and Safari 13+ all support it.',
      )
    }
  }

  const stopScreenShare = () => {
    screenStream?.getTracks().forEach((track) => track.stop())
    setScreenStream(null)
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-ink">
        {screenStream ? (
          <VideoPreview stream={screenStream} mirrored={false} className="object-contain" />
        ) : camera.status === 'ready' ? (
          <VideoPreview stream={camera.stream} />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-sm text-surface/60">
              {camera.status === 'requesting'
                ? 'Waiting for camera permission…'
                : camera.status === 'idle'
                  ? 'Your camera is off'
                  : statusMessage(camera.status, 'camera')}
            </p>
            {camera.status !== 'requesting' && (
              <Button size="sm" onClick={() => void camera.start()}>
                {camera.status === 'idle' ? 'Turn on camera' : 'Try again'}
              </Button>
            )}
          </div>
        )}

        {screenStream && (
          <>
            <Badge tone="live" className="absolute top-3 left-3 bg-live/25 text-surface">
              Sharing your screen
            </Badge>
            {camera.status === 'ready' && (
              <div className="absolute right-3 bottom-3 h-20 w-28 overflow-hidden rounded-card border border-surface/20 sm:h-24 sm:w-36">
                <VideoPreview stream={camera.stream} />
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap gap-2">
          {camera.status === 'ready' ? (
            <Button size="sm" variant="secondary" onClick={camera.stop}>
              Turn off camera
            </Button>
          ) : (
            <Button size="sm" onClick={() => void camera.start()}>
              Turn on camera
            </Button>
          )}

          {screenStream ? (
            <Button size="sm" variant="secondary" onClick={stopScreenShare}>
              Stop sharing
            </Button>
          ) : (
            <Button size="sm" variant="secondary" onClick={() => void testScreenShare()}>
              Test screen share
            </Button>
          )}
        </div>

        {camera.cameras.length > 1 && (
          <div className="flex flex-col gap-1.5">
            <Eyebrow>Camera</Eyebrow>
            <Select
              value={selectedCamera}
              onChange={(e) => {
                setSelectedCamera(e.target.value)
                void camera.start({ videoDeviceId: e.target.value })
              }}
            >
              <option value="">Default camera</option>
              {camera.cameras.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || 'Camera'}
                </option>
              ))}
            </Select>
          </div>
        )}

        {screenError && <p className="text-sm text-accent">{screenError}</p>}

        <p className="text-xs text-ink-faint">
          This preview is local — nothing is transmitted anywhere yet. Learners will see the shared
          screen large and your camera in the corner, exactly as laid out above.
        </p>
      </div>
    </Card>
  )
}
