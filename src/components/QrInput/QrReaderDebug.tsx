import { css } from '~styled-system/css';

interface QrReaderDebugProps {
  videoElement: HTMLVideoElement | null;
  isVideoReady: boolean;
  isScanning: boolean;
  videoWidth: number;
  videoHeight: number;
  scanCount: number;
  lastError: string | null;
  scannerType: 'native' | 'legacy';
}

export default function QrReaderDebug({
  videoElement,
  isVideoReady,
  isScanning,
  videoWidth,
  videoHeight,
  scanCount,
  lastError,
  scannerType,
}: QrReaderDebugProps) {
  return (
    <div className={cssDebugStatus}>
      <div>Video: {videoElement ? '✓' : '✗'}</div>
      <div>Ready: {isVideoReady ? 'true' : 'false'}</div>
      <div>
        Dim: {videoWidth}x{videoHeight}
      </div>
      <div>Scanner: {scannerType === 'native' ? 'BarcodeDetector' : 'jsQR (legacy)'}</div>
      <div>Scanning: {isScanning ? 'true' : 'false'}</div>
      <div>Scans: {scanCount}</div>
      {lastError && <div>Error: {lastError}</div>}
    </div>
  );
}

const cssDebugStatus = css({
  background: 'rgba(0, 0, 0, 0.8)',
  color: 'lime',
  padding: '10px',
  fontFamily: 'monospace',
  fontSize: '12px',
});
