import { useCallback, useEffect, useRef, useState } from 'react';
import { css } from '~styled-system/css';
import { AppError, ErrorCode } from '../../lib/errors';
import {
  detectQRCodes,
  isBarcodeDetectorSupported,
  type QrReaderData,
} from '../../lib/barcodeScanner';
import QrReaderDebug from './QrReaderDebug';

const SCAN_FPS = 2;
const FRAME_INTERVAL = 1000 / SCAN_FPS;

interface QrReaderProps {
  debug?: boolean;
  videoElement: HTMLVideoElement | null;
  disabled?: boolean;
  onChange?: (data: QrReaderData) => void;
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
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const showDebug = debug || new URLSearchParams(window.location.search).get('debug') === 'true';
  const canScan = !disabled && !!videoElement && isVideoReady;

  useEffect(() => {
    const supported = isBarcodeDetectorSupported();
    setIsSupported(supported);
    if (!supported) {
      onChangeRef.current?.({
        data: null,
        error: new AppError(
          'BarcodeDetector is not supported in this browser',
          ErrorCode.BARCODE_DETECTOR_NOT_SUPPORTED,
          'Please use Chrome 83+ or Edge 83+ on desktop, or Android (Chrome) to scan QR codes',
        ),
      });
    }
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
            onChange?.({ data: barcode, error: null });
            setLastError(null);
            setTimeout(() => {
              lastResultRef.current = '';
            }, 2000);
          }
        } else {
          onChange?.({ data: null, error: null });
        }
      } catch (e) {
        setLastError(String(e));
        const appError =
          e instanceof AppError
            ? e
            : new AppError(String(e), ErrorCode.BARCODE_DETECTOR_NOT_SUPPORTED);
        onChange?.({ data: null, error: appError });
      }

      animationFrameRef.current = requestAnimationFrame(scan);
    },
    [videoElement, canScan, disabled, onChange],
  );

  useEffect(() => {
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
