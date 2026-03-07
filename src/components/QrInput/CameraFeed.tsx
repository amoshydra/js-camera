import { css } from '~styled-system/css';
import CameraFeedErrorPresenter from './CameraFeedErrorPresenter';
import CameraStreamConfigurator from './CameraStreamConfigurator';
import { useCameraStreamReceiver } from './CameraStreamReceiver.hook';
import CameraVideo from './CameraVideo';

interface CameraFeedProps {
  onReady?: (videoEl: HTMLVideoElement) => void;
}

export default function CameraFeed({ onReady }: CameraFeedProps) {
  const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  const mediaDevicesSupportError = hasGetUserMedia
    ? null
    : new Error('mediaDevices is not supported');
  const { stream, loading, error, onVideoStreamContrainsChange, videoStreamConstraints } =
    useCameraStreamReceiver();

  const resolvedError = mediaDevicesSupportError || error || null;
  if (resolvedError) {
    <CameraFeedErrorPresenter error={resolvedError} />;
  }

  if (loading) {
    return <div>Requesting camera access...</div>;
  }

  return (
    <div className={cssWrapper}>
      <CameraStreamConfigurator
        value={videoStreamConstraints}
        onUpdateModelValue={onVideoStreamContrainsChange}
      />
      <CameraVideo
        stream={stream}
        onReady={onReady}
      />
    </div>
  );
}

const cssWrapper = css({
  width: '100%',
  background: 'slate.800',
  position: "relative",
});
