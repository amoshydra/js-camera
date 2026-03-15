import { type QrReaderData } from '@/lib/barcodeScanner';
import { useState } from 'react';
import { css, cx } from '~styled-system/css';
import CameraFeed from './CameraFeed';
import QrReader from './QrReader';
import { useCameraStreamReceiver } from './CameraStreamReceiver.hook';
import SettingsMenu from '../Settings/SettingsMenu';
import { configStore } from './CameraStreamConfigurator.lib';

interface QrInputProps {
  disabled?: boolean;
  onChange?: (data: QrReaderData) => void;
  className?: string;
}

export default function QrInput({ disabled = false, onChange, className }: QrInputProps) {
  const [cameraFeedVideoElement, setCameraFeedVideoElement] = useState<HTMLVideoElement | null>(
    null,
  );

  const {
    stream,
    loading,
    error,
    videoStreamConstraints,
    onVideoStreamContrainsChange,
    torchEnabled,
    zoomLevel,
    capabilities,
    applyTorch,
    applyZoom,
    flipCamera,
  } = useCameraStreamReceiver(disabled);

  const updateConfig = (config: typeof videoStreamConstraints) => {
    configStore.store(config);
    onVideoStreamContrainsChange(configStore.load());
  };

  return (
    <div className={cx(cssWrapper, className)}>
      <SettingsMenu
        value={videoStreamConstraints}
        onUpdateModelValue={updateConfig}
      />
      <CameraFeed
        onReady={setCameraFeedVideoElement}
        stream={stream}
        loading={loading}
        error={error}
        torchEnabled={torchEnabled}
        zoomLevel={zoomLevel}
        capabilities={capabilities}
        applyTorch={applyTorch}
        applyZoom={applyZoom}
        flipCamera={flipCamera}
      />
      <QrReader
        disabled={disabled}
        videoElement={cameraFeedVideoElement}
        onChange={onChange}
      />
    </div>
  );
}

const cssWrapper = css({
  position: 'relative',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
});
