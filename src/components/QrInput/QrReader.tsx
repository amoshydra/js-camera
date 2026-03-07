import { useEffect, useRef, useState } from 'react';
import jsQR, { QRCode } from 'jsqr';
import { css } from '../../../styled-system/css';
import QrReaderDebug from './QrReaderDebug';

interface QrReaderProps {
  debug?: boolean;
  videoElement: HTMLVideoElement | null;
  scanInterval?: number;
  disabled?: boolean;
  onChange?: (data: string | null) => void;
}

const cssCanvas = css({ width: '100%', display: 'none' });

export default function QrReader({
  debug = false,
  videoElement,
  scanInterval = 500,
  disabled = false,
  onChange,
}: QrReaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<QRCode | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [scanCount, setScanCount] = useState(0);

  const showDebug = debug || new URLSearchParams(window.location.search).get('debug') === 'true';
  const canScan = !disabled && !!videoElement && isVideoReady && isVideoPlaying;

  useEffect(() => {
    if (data) {
      onChange?.(data.data ?? null);
    }
  }, [data, onChange]);

  useEffect(() => {
    if (!videoElement) {
      setIsVideoReady(false);
      setIsVideoPlaying(false);
      return;
    }

    const initVideo = () => {
      setIsVideoReady(true);
      if (videoElement.readyState >= 2) {
        setupCanvas(videoElement);
      }
    };

    if (videoElement.readyState >= 2) {
      initVideo();
    } else {
      videoElement.addEventListener('loadedmetadata', initVideo, { once: true });
    }

    videoElement.addEventListener(
      'playing',
      () => {
        setIsVideoPlaying(true);
        setupCanvas(videoElement);
      },
      { once: true },
    );

    return () => {
      videoElement.removeEventListener('loadedmetadata', initVideo);
    };
  }, [videoElement]);

  const coordinateScanning = (ctx: CanvasRenderingContext2D, video: HTMLVideoElement) => {
    if (!canScan) return;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }

    setScanCount((c) => c + 1);

    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const imageData = ctx.getImageData(0, 0, video.videoWidth, video.videoHeight);

    try {
      const code = jsQR(imageData.data, video.videoWidth, video.videoHeight);
      if (code && code.data) {
        setData(code);
        setLastError(null);
      } else {
        setLastError('No QR found');
      }
    } catch (e) {
      setLastError(String(e));
    }
  };

  const setupCanvas = (video: HTMLVideoElement) => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;

    ctx.canvas.width = video.videoWidth;
    ctx.canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);

    doScan(ctx, video);
  };

  const doScan = (ctx: CanvasRenderingContext2D, video: HTMLVideoElement) => {
    if (disabled) {
      setIsScanning(false);
      return;
    }

    setIsScanning(true);
    coordinateScanning(ctx, video);

    setTimeout(() => {
      if (!disabled) {
        doScan(ctx, video);
      }
    }, scanInterval);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className={cssCanvas}
      />
      {showDebug && (
        <QrReaderDebug
          videoElement={videoElement}
          isVideoReady={isVideoReady}
          isVideoPlaying={isVideoPlaying}
          isScanning={isScanning}
          videoWidth={videoElement?.videoWidth ?? 0}
          videoHeight={videoElement?.videoHeight ?? 0}
          data={data?.data ?? null}
          scanCount={scanCount}
          lastError={lastError}
        />
      )}
    </>
  );
}
