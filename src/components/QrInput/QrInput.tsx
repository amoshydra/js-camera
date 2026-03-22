import { type QrReaderData } from '@/lib/barcodeScanner';
import { useCallback, useMemo, useState } from 'react';
import { css, cx } from '~styled-system/css';
import CameraFeed from './CameraFeed';
import QrReader from './QrReader';
import { useCameraStreamReceiver, type VideoSourceType } from './CameraStreamReceiver.hook';
import SettingsMenu from '../Settings/SettingsMenu';
import { configStore, extractOrGetFirst } from './CameraStreamConfigurator.lib';
import ModeToggle, { type Mode } from '../ModeToggle/ModeToggle';

interface QrInputProps {
  disabled?: boolean;
  onChange?: (data: QrReaderData) => void;
  className?: string;
  mode?: Mode;
  onModeChange?: (mode: Mode) => void;
  onVideoElement?: (element: HTMLVideoElement | null) => void;
  enableAiMode?: boolean;
}

const getSourceType = (constraints: ReturnType<typeof configStore.load>): VideoSourceType => {
  if (typeof constraints !== 'object' || constraints === null) return 'camera';

  const deviceId = extractOrGetFirst((constraints as MediaTrackConstraints).deviceId);

  if (typeof deviceId === 'string' && deviceId === 'screen') {
    return 'screen';
  }

  return 'camera';
};

export default function QrInput({
  disabled = false,
  onChange,
  className,
  mode = 'qr',
  onModeChange,
  onVideoElement,
  enableAiMode = false,
}: QrInputProps) {
  const [cameraFeedVideoElement, setCameraFeedVideoElement] = useState<HTMLVideoElement | null>(
    null,
  );

  const videoStreamConstraints = useMemo(() => configStore.load(), []);
  const sourceType = getSourceType(videoStreamConstraints);

  const {
    stream,
    loading,
    error,
    onVideoStreamContrainsChange,
    torchEnabled,
    zoomLevel,
    capabilities,
    applyTorch,
    applyZoom,
    flipCamera,
    screenCaptureEnded,
    retryScreenCapture,
  } = useCameraStreamReceiver(disabled, sourceType);

  const updateConfig = (config: typeof videoStreamConstraints) => {
    configStore.store(config);
    onVideoStreamContrainsChange(configStore.load());
  };

  const handleVideoReady = useCallback(
    (element: HTMLVideoElement) => {
      setCameraFeedVideoElement(element);
      onVideoElement?.(element);
    },
    [onVideoElement],
  );

  return (
    <div className={cx(cssWrapper, className)}>
      <div className={cssControls}>
        {enableAiMode && (
          <ModeToggle
            mode={mode}
            onChange={onModeChange ?? (() => {})}
          />
        )}
        <SettingsMenu
          value={videoStreamConstraints}
          onUpdateModelValue={updateConfig}
        />
      </div>
      <CameraFeed
        onReady={handleVideoReady}
        stream={stream}
        loading={loading}
        error={error}
        torchEnabled={torchEnabled}
        zoomLevel={zoomLevel}
        capabilities={capabilities}
        applyTorch={applyTorch}
        applyZoom={applyZoom}
        flipCamera={flipCamera}
        sourceType={sourceType}
        screenCaptureEnded={screenCaptureEnded}
        onRetryScreenCapture={retryScreenCapture}
      />
      {mode === 'qr' && (
        <QrReader
          disabled={disabled}
          videoElement={cameraFeedVideoElement}
          onChange={onChange}
        />
      )}
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

const cssControls = css({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: 2,
  zIndex: 10,
});
