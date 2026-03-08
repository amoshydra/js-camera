import { type QrReaderData } from '@/lib/barcodeScanner';
import { useState } from 'react';
import { cx } from '~styled-system/css';
import { useIdle } from '@/hooks/useIdle';
import CameraFeed from './CameraFeed';
import QrReader from './QrReader';

interface QrInputProps {
  disabled?: boolean;
  onChange?: (data: QrReaderData) => void;
  className?: string;
}

export default function QrInput({ disabled = false, onChange, className }: QrInputProps) {
  const [cameraFeedVideoElement, setCameraFeedVideoElement] = useState<HTMLVideoElement | null>(
    null,
  );
  const isIdle = useIdle();

  return (
    <div className={cx(className)}>
      <CameraFeed
        onReady={setCameraFeedVideoElement}
        paused={isIdle || disabled}
      />
      <QrReader
        disabled={disabled}
        videoElement={cameraFeedVideoElement}
        onChange={onChange}
        paused={isIdle || disabled}
      />
    </div>
  );
}
