import { useEffect, useRef } from 'react';
import { css, cx } from '~styled-system/css';

interface CameraVideoProps {
  stream: MediaStream | null;
  onReady?: (videoEl: HTMLVideoElement) => void;
  className?: string;
}

export default function CameraVideo({ stream, onReady, className }: CameraVideoProps) {
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
      className={cx(cssVideo, className)}
      autoPlay
      playsInline
      muted
      onLoadedData={handleLoadedData}
    />
  );
}

const cssVideo = css({
  width: '100%',
  aspectRatio: '1 / 1',
  background: 'zinc.900',
  objectFit: 'contain',
});
