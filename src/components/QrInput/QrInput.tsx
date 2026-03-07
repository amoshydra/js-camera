import { useRef, useState } from 'react';
import QrReader from './QrReader';
import CameraFeed from './CameraFeed';

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
      <CameraFeed
        autoplay
        onReady={setCameraFeedVideoElement}
      />
      <QrReader
        disabled={disabled}
        videoElement={cameraFeedVideoElement}
        onChange={onChange}
      />
    </div>
  );
}
