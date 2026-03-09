import { css, cx } from '~styled-system/css';
import CameraFeedErrorPresenter from './CameraFeedErrorPresenter';
import CameraStreamConfigurator from './CameraStreamConfigurator';
import { useCameraStreamReceiver } from './CameraStreamReceiver.hook';
import CameraVideo from './CameraVideo';

interface CameraFeedProps {
  onReady: (videoEl: HTMLVideoElement) => void;
  disabled: boolean;
}

export default function CameraFeed({ onReady, disabled }: CameraFeedProps) {
  const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  const mediaDevicesSupportError = hasGetUserMedia
    ? null
    : new Error('mediaDevices is not supported');
  const { stream, loading, error, onVideoStreamContrainsChange, videoStreamConstraints } =
    useCameraStreamReceiver(disabled);

  const resolvedError = mediaDevicesSupportError || error || null;
  if (resolvedError) {
    return (
      <CameraFeedErrorPresenter
        error={resolvedError}
        className={cx(cssWrapper, cssViewfinderLiked)}
      />
    );
  }

  if (loading) {
    return <div className={cx(cssWrapper, cssViewfinderLiked)}>Requesting camera access...</div>;
  }

  if (!stream) {
    return <div className={cx(cssWrapper, cssViewfinderLiked)}>Tap to activate</div>;
  }

  return (
    <div className={cssWrapper}>
      <CameraStreamConfigurator
        value={videoStreamConstraints}
        onUpdateModelValue={onVideoStreamContrainsChange}
      />
      <CameraVideo
        className={cssViewFinder}
        stream={stream}
        onReady={onReady}
      />
    </div>
  );
}

const cssWrapper = css({
  width: '100%',
  background: 'stone.900',
  position: 'relative',
  borderRadius: 'xl',
  overflow: 'hidden',
});

const cssViewFinderCss = css.raw({
  aspectRatio: '1 / 1',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
});

const cssViewFinder = css(cssViewFinderCss, {
  background: 'zinc.900',
});
const cssViewfinderLiked = css(cssViewFinderCss, {});
