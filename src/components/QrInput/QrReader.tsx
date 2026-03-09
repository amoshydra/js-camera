import { useCallback, useEffect, useRef, useState } from 'react';
import { css } from '~styled-system/css';
import {
  isBarcodeDetectorSupported,
  detectQRCodes as nativeDetectQRCodes,
  type DetectedBarcode,
  type QrReaderData,
} from '../../lib/barcodeScanner';
import { detectQRCodes as legacyDetectQRCodes } from '../../lib/legacyBarcodeScanner';
import { settingsStore } from './CameraStreamConfigurator.lib';
import QrReaderDebug from './QrReaderDebug';

const SCAN_FPS = 2;
const FRAME_INTERVAL = 1000 / SCAN_FPS;

interface QrReaderProps {
  videoElement: HTMLVideoElement | null;
  disabled: boolean;
  onChange: (data: QrReaderData) => void;
}

export default function QrReader({ videoElement, disabled = false, onChange }: QrReaderProps) {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [scanCount, setScanCount] = useState(0);
  const [scannerType, setScannerType] = useState<'native' | 'legacy'>('native');
  const [urlVersion, setUrlVersion] = useState(0);

  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const lastResultRef = useRef<string>('');
  const onChangeRef = useRef(onChange);
  const hasTriedLegacyRef = useRef(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const handleSettingsChange = () => {
      setUrlVersion((v) => v + 1);
    };
    window.addEventListener('js-camera-settings-change', handleSettingsChange);
    return () => window.removeEventListener('js-camera-settings-change', handleSettingsChange);
  }, []);

  const getSettings = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      debug: params.get('debug') === 'true',
      scanner: params.get('scanner') === 'legacy' ? 'legacy' : 'browser',
    };
  };

  const currentSettings = urlVersion === 0 ? settingsStore.settings : getSettings();
  const showDebug = currentSettings.debug;
  const canScan = !disabled && !!videoElement && isVideoReady;

  useEffect(() => {
    if (settingsStore.settings.scanner === 'legacy') {
      setScannerType('legacy');
      return;
    }

    const supported = isBarcodeDetectorSupported();
    if (!supported) {
      setScannerType('legacy');
    }
  }, []);

  const detectQRCodes = useCallback(
    async (video: HTMLVideoElement): Promise<DetectedBarcode[]> => {
      if (scannerType === 'legacy') {
        return legacyDetectQRCodes(video);
      }
      return nativeDetectQRCodes(video);
    },
    [scannerType],
  );

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
            onChange?.({ data: barcode, error: null, scannerType });
            setLastError(null);
            setTimeout(() => {
              lastResultRef.current = '';
            }, 2000);
          }
        } else {
          onChange?.({ data: null, error: null, scannerType });
        }
      } catch (e) {
        setLastError(String(e));

        if (scannerType === 'native' && !hasTriedLegacyRef.current) {
          hasTriedLegacyRef.current = true;
          setScannerType('legacy');
          onChange?.({ data: null, error: null, scannerType: 'legacy' });
        }
      }

      animationFrameRef.current = requestAnimationFrame(scan);
    },
    [videoElement, canScan, disabled, onChange, detectQRCodes, scannerType],
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
  }, [videoElement]);

  useEffect(() => {
    if (canScan) {
      animationFrameRef.current = requestAnimationFrame(scan);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [canScan, scan]);

  return (
    <div className={cssCanvasWrapper}>
      {showDebug && (
        <QrReaderDebug
          videoElement={videoElement}
          isVideoReady={isVideoReady}
          isScanning={isScanning}
          videoWidth={videoElement?.videoWidth ?? 0}
          videoHeight={videoElement?.videoHeight ?? 0}
          scanCount={scanCount}
          lastError={lastError}
          scannerType={scannerType}
        />
      )}
    </div>
  );
}

const cssCanvasWrapper = css({
  position: 'relative',
  width: 'full',
  height: 'full',
});
