import { useState, useEffect, ReactNode } from 'react'
import CameraStreamConfigurator from './CameraStreamConfigurator'
import { CameraStreamReceiverSlotData } from './CameraStreamReceiver.lib'
import { VideoStreamConstrain } from './ConfigurationStorage'

interface CameraStreamReceiverProps {
  renderSlot?: (slotData: CameraStreamReceiverSlotData) => ReactNode
  children?: ReactNode
}

export default function CameraStreamReceiver({
  renderSlot,
  children,
}: CameraStreamReceiverProps) {
  const [error, setError] = useState<Error | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [videoStreamConstraints, setVideoStreamConstraints] = useState<VideoStreamConstrain>(
    undefined
  )

  useEffect(() => {
    getCamera(videoStreamConstraints)
  }, [videoStreamConstraints])

  const getCamera = async (
    videoStreamConstraints: MediaStreamConstraints['video']
  ): Promise<void> => {
    setError(null)

    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: videoStreamConstraints,
      })
      setStream(newStream)
    } catch (err) {
      setError(err instanceof Error ? err : null)
      setStream(null)
    }
  }

  const slotData: CameraStreamReceiverSlotData =
    error !== null
      ? {
          error,
          stream: null,
        }
      : {
          error: null,
          stream,
        }

  return (
    <div>
      <CameraStreamConfigurator
        value={videoStreamConstraints}
        onUpdateModelValue={setVideoStreamConstraints}
      />
      {renderSlot ? renderSlot(slotData) : children}
    </div>
  )
}
