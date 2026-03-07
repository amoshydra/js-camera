import { useState } from 'react';
import CameraFeed from './CameraFeed';
import QrReader from './QrReader';

interface QrInputProps {
  disabled?: boolean;
  onChange?: (data: string | null) => void;
}

export default function QrInput({ disabled = false, onChange }: QrInputProps) {
  const [cameraFeedVideoElement, setCameraFeedVideoElement] = useState<HTMLVideoElement | null>(
    null,
  );

  return (
    <div>
      <CameraFeed onReady={setCameraFeedVideoElement} />
      <QrReader
        disabled={disabled}
        videoElement={cameraFeedVideoElement}
        onChange={onChange}
      />
    </div>
  );
}
