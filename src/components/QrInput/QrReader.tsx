import { useEffect, useRef, useState, useCallback } from 'react';
import { css } from '~styled-system/css';
import QrReaderDebug from './QrReaderDebug';
import {
  detectQRCodes,
  isBarcodeDetectorSupported,
  type DetectedBarcode,
} from '../../lib/barcodeScanner';

const SCAN_FPS = 2;
const FRAME_INTERVAL = 1000 / SCAN_FPS;

interface QrReaderProps {
  debug?: boolean;
  videoElement: HTMLVideoElement | null;
  disabled?: boolean;
  onChange?: (data: DetectedBarcode | null) => void;
}

export default function QrReader({
  debug = false,
  videoElement,
  disabled = false,
  onChange,
}: QrReaderProps) {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [scanCount, setScanCount] = useState(0);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const lastResultRef = useRef<string>('');

  const showDebug = debug || new URLSearchParams(window.location.search).get('debug') === 'true';
  const canScan = !disabled && !!videoElement && isVideoReady;

  useEffect(() => {
    setIsSupported(isBarcodeDetectorSupported());
  }, []);

  const scan = useCallback(
    async (timestamp: number) => {
      if (!videoElement || !canScan || disabled) {
        setIsScanning(false);
        return;
      }

      if (timestamp - lastFrameTimeRef.current < FRAME_INTERVAL) {
        animationFrameRef.current = requestAnimationFrame(scan);
        return;
      }
      lastFrameTimeRef.current = timestamp;

      if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
        animationFrameRef.current = requestAnimationFrame(scan);
        return;
      }

      setIsScanning(true);

      try {
        const barcodes = await detectQRCodes(videoElement);
        setScanCount((c) => c + 1);

        if (barcodes.length > 0) {
          const barcode = barcodes[0];
          if (barcode.rawValue !== lastResultRef.current) {
            lastResultRef.current = barcode.rawValue;
            onChange?.(barcode);
            setLastError(null);
            setTimeout(() => {
              lastResultRef.current = '';
            }, 2000);
          }
        } else {
          onChange?.(null);
        }
      } catch (e) {
        setLastError(String(e));
      }

      animationFrameRef.current = requestAnimationFrame(scan);
    },
    [videoElement, canScan, disabled, onChange],
  );

  useEffect(() => {
    if (isSupported === false) {
      setLastError('BarcodeDetector is not supported in this browser');
      return;
    }

    if (!videoElement) {
      setIsVideoReady(false);
      setIsScanning(false);
      return;
    }

    const initVideo = () => {
      setIsVideoReady(true);
    };

    if (videoElement.readyState >= 2) {
      initVideo();
    } else {
      videoElement.addEventListener('loadedmetadata', initVideo, { once: true });
    }

    videoElement.addEventListener('playing', initVideo, { once: true });

    return () => {
      videoElement.removeEventListener('loadedmetadata', initVideo);
      videoElement.removeEventListener('playing', initVideo);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [videoElement, isSupported]);

  useEffect(() => {
    if (canScan && isSupported !== false) {
      animationFrameRef.current = requestAnimationFrame(scan);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [canScan, isSupported, scan]);

  return (
    <div
      data-debug={showDebug}
      className={cssCanvasWrapper}
    >
      {showDebug && (
        <QrReaderDebug
          videoElement={videoElement}
          isVideoReady={isVideoReady}
          isScanning={isScanning}
          videoWidth={videoElement?.videoWidth ?? 0}
          videoHeight={videoElement?.videoHeight ?? 0}
          scanCount={scanCount}
          lastError={lastError}
        />
      )}
    </div>
  );
}

const cssCanvasWrapper = css({
  display: 'none',
  '&[data-debug="true"]': {
    display: 'flex',
  },

  background: 'rgba(0, 0, 0, 0.8)',
});
