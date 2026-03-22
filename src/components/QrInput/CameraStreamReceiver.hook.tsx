import { useCallback, useEffect, useRef, useState } from 'react';
import { ConfigurationStorage, VideoStreamConstrain } from './ConfigurationStorage';
import { getScreenStream, isScreenCaptureSupported } from '@/lib/screenCapture';
import { AppError, ErrorCode } from '@/lib/errors';

export type VideoSourceType = 'camera' | 'screen';

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

export const useCameraStreamReceiver = (paused = false, sourceType: VideoSourceType = 'camera') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoStreamConstraints, setVideoStreamConstraints] = useState<VideoStreamConstrain>(
    ConfigurationStorage.defaultConfig,
  );
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [capabilities, setCapabilities] = useState<MediaTrackCapabilities | null>(null);
  const [screenCaptureEnded, setScreenCaptureEnded] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const videoTrackRef = useRef<MediaStreamTrack | null>(null);
  const sourceTypeRef = useRef<VideoSourceType>(sourceType);

  sourceTypeRef.current = sourceType;

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

  const startScreenCapture = useCallback(async () => {
    if (!isScreenCaptureSupported()) {
      setError(
        new AppError(
          'Screen capture is not supported',
          ErrorCode.SCREEN_CAPTURE_NOT_SUPPORTED,
          'Please use a browser that supports getDisplayMedia',
        ),
      );
      setStream(null);
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);
    setScreenCaptureEnded(false);

    try {
      const newStream = await getScreenStream();
      streamRef.current = newStream;
      const videoTrack = newStream.getVideoTracks()[0];
      videoTrackRef.current = videoTrack;

      videoTrack.onended = () => {
        setScreenCaptureEnded(true);
        setError(
          new AppError(
            'Screen capture ended',
            ErrorCode.SCREEN_CAPTURE_STOPPED,
            'Click "Select Screen" to capture again',
          ),
        );
      };

      updateCapabilities(videoTrack);
      setStream(newStream);
    } catch (err) {
      if ((err as Error).name === 'NotAllowedError') {
        setScreenCaptureEnded(true);
      } else {
        setError(err instanceof Error ? err : null);
        setStream(null);
      }
    }
    setLoading(false);
  }, []);

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

    if (sourceTypeRef.current === 'screen') {
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
  }, [paused, sourceType, startScreenCapture]);

  return {
    videoStreamConstraints,
    onVideoStreamContrainsChange: updateConstraints,
    error,
    loading,
    stream: error && sourceType !== 'screen' ? null : stream,
    torchEnabled,
    zoomLevel,
    capabilities,
    applyTorch,
    applyZoom,
    flipCamera,
    screenCaptureEnded,
    retryScreenCapture: startScreenCapture,
    sourceType,
  };
};
