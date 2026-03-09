import { useEffect, useRef, useState } from 'react';
import { ConfigurationStorage, VideoStreamConstrain } from './ConfigurationStorage';

const requiresSourceChange = (
  oldConstraints: VideoStreamConstrain,
  newConstraints: VideoStreamConstrain,
): boolean => {
  if (!oldConstraints || !newConstraints) return false;
  if (typeof oldConstraints === 'boolean' || typeof newConstraints === 'boolean') return false;

  const oldDeviceId = (oldConstraints as MediaTrackConstraints).deviceId;
  const newDeviceId = (newConstraints as MediaTrackConstraints).deviceId;
  if (oldDeviceId !== newDeviceId) return true;

  const oldFacingMode = (oldConstraints as MediaTrackConstraints).facingMode;
  const newFacingMode = (newConstraints as MediaTrackConstraints).facingMode;
  if (oldFacingMode !== newFacingMode) return true;

  return false;
};

export const useCameraStreamReceiver = (paused = false) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoStreamConstraints, setVideoStreamConstraints] = useState<VideoStreamConstrain>(
    ConfigurationStorage.defaultConfig,
  );
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [capabilities, setCapabilities] = useState<MediaTrackCapabilities | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const videoTrackRef = useRef<MediaStreamTrack | null>(null);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      videoTrackRef.current = null;
      setStream(null);
      setCapabilities(null);
    }
  };

  const applyConstraints = async (constraints: VideoStreamConstrain) => {
    const track = videoTrackRef.current;
    if (!track || !constraints || typeof constraints === 'boolean') {
      return false;
    }

    try {
      await track.applyConstraints(constraints);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : null);
      return false;
    }
  };

  const applyTorch = async (enabled: boolean) => {
    const track = videoTrackRef.current;
    if (!track) return false;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await track.applyConstraints({ advanced: [{ torch: enabled }] } as any);
      setTorchEnabled(enabled);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : null);
      return false;
    }
  };

  const applyZoom = async (zoom: number) => {
    const track = videoTrackRef.current;
    if (!track) return false;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await track.applyConstraints({ zoom } as any);
      setZoomLevel(zoom);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : null);
      return false;
    }
  };

  const updateCapabilities = (videoTrack: MediaStreamTrack) => {
    const trackCapabilities = videoTrack.getCapabilities();
    if (trackCapabilities) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const caps = trackCapabilities as any;
      setCapabilities(caps);
      if (caps.zoom) {
        const zoomVal = typeof caps.zoom === 'number' ? caps.zoom : (caps.zoom?.ideal ?? 1);
        setZoomLevel(zoomVal);
      }
    }
  };

  const startStream = async (constraints: VideoStreamConstrain) => {
    setError(null);
    setLoading(true);

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: constraints,
      });
      streamRef.current = newStream;
      const videoTrack = newStream.getVideoTracks()[0];
      videoTrackRef.current = videoTrack;

      updateCapabilities(videoTrack);

      setStream(newStream);
    } catch (err) {
      setError(err instanceof Error ? err : null);
      setStream(null);
    }
    setLoading(false);
  };

  const updateConstraints = (newConstraints: VideoStreamConstrain) => {
    setVideoStreamConstraints(newConstraints);

    if (requiresSourceChange(videoStreamConstraints, newConstraints)) {
      stopStream();
      startStream(newConstraints);
    } else {
      applyConstraints(newConstraints);
    }
  };

  const flipCamera = () => {
    const currentFacingMode = (videoStreamConstraints as MediaTrackConstraints).facingMode;
    const newFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
    const newConstraints = {
      ...(videoStreamConstraints as object),
      facingMode: newFacingMode,
    } as VideoStreamConstrain;
    updateConstraints(newConstraints);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          const videoTrack = newStream.getVideoTracks()[0];
          videoTrackRef.current = videoTrack;
          updateCapabilities(videoTrack);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps (videoStreamConstraints)
  }, [paused]);

  return {
    videoStreamConstraints,
    onVideoStreamContrainsChange: updateConstraints,
    error,
    loading,
    stream: error ? null : stream,
    torchEnabled,
    zoomLevel,
    capabilities,
    applyTorch,
    applyZoom,
    flipCamera,
  };
};
