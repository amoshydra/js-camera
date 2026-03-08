import { useEffect, useRef, useState } from 'react';
import { ConfigurationStorage, VideoStreamConstrain } from './ConfigurationStorage';

export const useCameraStreamReceiver = (paused = false) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoStreamConstraints, setVideoStreamConstraints] = useState<VideoStreamConstrain>(
    ConfigurationStorage.defaultConfig,
  );
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStream(null);
    }
  };

  useEffect(() => {
    if (paused) {
      stopStream();
      return;
    }

    let cancelled = false;

    const getCamera = async (
      videoStreamConstraints: MediaStreamConstraints['video'],
    ): Promise<void> => {
      setError(null);
      setLoading(true);

      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: videoStreamConstraints,
        });
        if (!cancelled) {
          streamRef.current = newStream;
          setStream(newStream);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : null);
          setStream(null);
        }
      }
      if (!cancelled) {
        setLoading(false);
      }
    };

    getCamera(videoStreamConstraints);
    return () => {
      cancelled = true;
      stopStream();
    };
  }, [videoStreamConstraints, paused]);

  return {
    videoStreamConstraints,
    onVideoStreamContrainsChange: setVideoStreamConstraints,
    error,
    loading,
    stream: error ? null : stream,
  };
};
