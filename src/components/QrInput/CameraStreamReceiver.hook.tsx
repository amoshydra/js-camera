import { useEffect, useState } from 'react';
import { ConfigurationStorage, VideoStreamConstrain } from './ConfigurationStorage';

export const useCameraStreamReceiver = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoStreamConstraints, setVideoStreamConstraints] = useState<VideoStreamConstrain>(
    ConfigurationStorage.defaultConfig,
  );

  useEffect(() => {
    let newStream: MediaStream | null = null;

    const getCamera = async (
      videoStreamConstraints: MediaStreamConstraints['video'],
    ): Promise<void> => {
      setError(null);
      setLoading(true);

      try {
        newStream = await navigator.mediaDevices.getUserMedia({
          video: videoStreamConstraints,
        });
        setStream(newStream);
      } catch (err) {
        setError(err instanceof Error ? err : null);
        setStream(null);
      }
      setLoading(false);
    };

    getCamera(videoStreamConstraints);
    return () => {
      if (newStream) {
        newStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoStreamConstraints]);

  return {
    videoStreamConstraints,
    onVideoStreamContrainsChange: setVideoStreamConstraints,
    error,
    loading,
    stream: error ? null : stream,
  };
};
