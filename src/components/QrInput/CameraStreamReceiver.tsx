import { ReactNode, useEffect, useState } from 'react';
import CameraStreamConfigurator from './CameraStreamConfigurator';
import { CameraStreamReceiverSlotData } from './CameraStreamReceiver.lib';
import { ConfigurationStorage, VideoStreamConstrain } from './ConfigurationStorage';

interface CameraStreamReceiverProps {
  renderSlot?: (slotData: CameraStreamReceiverSlotData) => ReactNode;
  children?: ReactNode;
}

export default function CameraStreamReceiver({ renderSlot, children }: CameraStreamReceiverProps) {
  const [error, setError] = useState<Error | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoStreamConstraints, setVideoStreamConstraints] = useState<VideoStreamConstrain>(
    () => ConfigurationStorage.defaultConfig,
  );

  useEffect(() => {
    const getCamera = async (
      videoStreamConstraints: MediaStreamConstraints['video'],
    ): Promise<void> => {
      setError(null);

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: videoStreamConstraints,
        });
        setStream(newStream);
      } catch (err) {
        setError(err instanceof Error ? err : null);
        setStream(null);
      }
    };

    getCamera(videoStreamConstraints);
  }, [stream, videoStreamConstraints]);

  const slotData: CameraStreamReceiverSlotData =
    error !== null
      ? {
          error,
          stream: null,
        }
      : {
          error: null,
          stream,
        };

  return (
    <div>
      <CameraStreamConfigurator
        value={videoStreamConstraints}
        onUpdateModelValue={setVideoStreamConstraints}
      />
      {renderSlot ? renderSlot(slotData) : children}
    </div>
  );
}
