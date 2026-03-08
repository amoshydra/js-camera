import { type DetectedBarcode } from '@/lib/barcodeScanner';
import { useState } from 'react';
import { cx } from '~styled-system/css';
import CameraFeed from './CameraFeed';
import QrReader from './QrReader';

interface QrInputProps {
  disabled?: boolean;
  onChange?: (data: DetectedBarcode | null) => void;
  className?: string;
}

export default function QrInput({ disabled = false, onChange, className }: QrInputProps) {
  const [cameraFeedVideoElement, setCameraFeedVideoElement] = useState<HTMLVideoElement | null>(
    null,
  );

  return (
    <div className={cx(className)}>
      <CameraFeed onReady={setCameraFeedVideoElement} />
      <QrReader
        disabled={disabled}
        videoElement={cameraFeedVideoElement}
        onChange={onChange}
      />
    </div>
  );
}
