import { useRef, useEffect } from 'react';
import { css } from '../../../styled-system/css';

interface CameraVideoProps {
  stream: MediaStream | null;
  onReady?: (videoEl: HTMLVideoElement) => void;
}

const cssVideo = css({ width: '100%' });

export default function CameraVideo({ stream, onReady }: CameraVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.srcObject = stream;
  }, [stream]);

  const handleLoadedData = () => {
    const videoEl = videoRef.current;
    if (videoEl) {
      onReady?.(videoEl);
    }
  };

  return (
    <video
      ref={videoRef}
      className={cssVideo}
      autoPlay
      playsInline
      onLoadedData={handleLoadedData}
    />
  );
}
