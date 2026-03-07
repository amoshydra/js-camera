import { css } from '../../../styled-system/css'

interface QrReaderDebugProps {
  videoElement: HTMLVideoElement | null
  isVideoReady: boolean
  isVideoPlaying: boolean
  isScanning: boolean
  videoWidth: number
  videoHeight: number
  data: string | null
  scanCount: number
  lastError: string | null
}

const cssDebugStatus = css({
  position: 'fixed',
  bottom: '0',
  left: '0',
  right: '0',
  background: 'rgba(0, 0, 0, 0.8)',
  color: 'lime',
  padding: '10px',
  fontFamily: 'monospace',
  fontSize: '12px',
  zIndex: '9999',
})

export default function QrReaderDebug({
  videoElement,
  isVideoReady,
  isVideoPlaying,
  isScanning,
  videoWidth,
  videoHeight,
  data,
  scanCount,
  lastError,
}: QrReaderDebugProps) {
  return (
    <div className={cssDebugStatus}>
      <div>Video: {videoElement ? '✓' : '✗'}</div>
      <div>Ready: {isVideoReady ? 'true' : 'false'}</div>
      <div>Playing: {isVideoPlaying ? 'true' : 'false'}</div>
      <div>Dim: {videoWidth}x{videoHeight}</div>
      <div>Scanning: {isScanning ? 'true' : 'false'}</div>
      <div>Data: {data || 'none'}</div>
      <div>Scans: {scanCount}</div>
      {lastError && <div>Error: {lastError}</div>}
    </div>
  )
}
