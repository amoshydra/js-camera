import { css, cx } from '~styled-system/css';
import CameraControls from './CameraControls';
import CameraFeedErrorPresenter from './CameraFeedErrorPresenter';
import CameraStreamConfigurator from './CameraStreamConfigurator';
import { useCameraStreamReceiver } from './CameraStreamReceiver.hook';
import CameraVideo from './CameraVideo';

interface CameraFeedProps {
  onReady: (videoEl: HTMLVideoElement) => void;
  disabled: boolean;
}

export default function CameraFeed({ onReady, disabled }: CameraFeedProps) {
  const {
    stream,
    loading,
    error,
    onVideoStreamContrainsChange,
    videoStreamConstraints,
    torchEnabled,
    zoomLevel,
    capabilities,
    applyTorch,
    applyZoom,
    flipCamera,
  } = useCameraStreamReceiver(disabled);

  return (
    <>
      <div className={cssWrapper}>
        <CameraStreamConfigurator
          value={videoStreamConstraints}
          onUpdateModelValue={onVideoStreamContrainsChange}
        />
        <_CameraFeed
          onReady={onReady}
          loading={loading}
          stream={stream}
          error={error}
        />
      </div>
      <CameraControls
        torchEnabled={torchEnabled}
        zoomLevel={zoomLevel}
        capabilities={capabilities}
        applyTorch={applyTorch}
        applyZoom={applyZoom}
        onFlip={flipCamera}
        className={css({ marginTop: 2 })}
      />
    </>
  );
}

interface _CameraFeedProps {
  onReady: (videoEl: HTMLVideoElement) => void;
  loading: boolean;
  stream: MediaStream;
  error: Error;
}

function _CameraFeed({ onReady, loading, stream, error }: _CameraFeedProps) {
  const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  const mediaDevicesSupportError = hasGetUserMedia
    ? null
    : new Error('mediaDevices is not supported');

  const resolvedError = mediaDevicesSupportError || error || null;
  if (resolvedError) {
    return (
      <CameraFeedErrorPresenter
        error={resolvedError}
        className={cx(cssViewfinderLiked)}
      />
    );
  }

  if (loading) {
    return <div className={cx(cssViewfinderLiked)}>Requesting camera access...</div>;
  }

  if (!stream) {
    return <div className={cx(cssViewfinderLiked)}>Tap to activate</div>;
  }

  return (
    <CameraVideo
      className={cssViewFinder}
      stream={stream}
      onReady={onReady}
    />
  );
}

const cssWrapper = css({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
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
