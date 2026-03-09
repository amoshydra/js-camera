import { useEffect, useRef } from 'react';

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
      className={className}
      autoPlay
      playsInline
      muted
      onLoadedData={handleLoadedData}
    />
  );
}
