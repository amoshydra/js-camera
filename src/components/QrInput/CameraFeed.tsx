import { css, cx } from '~styled-system/css';
import CameraControls from './CameraControls';
import CameraFeedErrorPresenter from './CameraFeedErrorPresenter';
import CameraVideo from './CameraVideo';
import type { VideoSourceType } from './CameraStreamReceiver.hook';

interface CameraFeedProps {
  onReady: (videoEl: HTMLVideoElement) => void;
  stream: MediaStream | null;
  loading: boolean;
  error: Error | null;
  torchEnabled: boolean;
  zoomLevel: number;
  capabilities: MediaTrackCapabilities | null;
  applyTorch: (enabled: boolean) => Promise<boolean>;
  applyZoom: (zoom: number) => Promise<boolean>;
  flipCamera: () => void;
  sourceType: VideoSourceType;
  screenCaptureEnded?: boolean;
  onRetryScreenCapture?: () => void;
}

export default function CameraFeed({
  onReady,
  stream,
  loading,
  error,
  torchEnabled,
  zoomLevel,
  capabilities,
  applyTorch,
  applyZoom,
  flipCamera,
  sourceType,
  screenCaptureEnded,
  onRetryScreenCapture,
}: CameraFeedProps) {
  const isScreenCapture = sourceType === 'screen';

  return (
    <>
      <div className={cssWrapper}>
        <_CameraFeed
          onReady={onReady}
          loading={loading}
          stream={stream}
          error={error}
          screenCaptureEnded={screenCaptureEnded}
          onRetryScreenCapture={onRetryScreenCapture}
          isScreenCapture={isScreenCapture}
        />
      </div>
      {!isScreenCapture && (
        <CameraControls
          torchEnabled={torchEnabled}
          zoomLevel={zoomLevel}
          capabilities={capabilities}
          applyTorch={applyTorch}
          applyZoom={applyZoom}
          onFlip={flipCamera}
          className={css({ marginTop: 2 })}
        />
      )}
    </>
  );
}

interface _CameraFeedProps {
  onReady: (videoEl: HTMLVideoElement) => void;
  loading: boolean;
  stream: MediaStream | null;
  error: Error | null;
  screenCaptureEnded?: boolean;
  onRetryScreenCapture?: () => void;
  isScreenCapture?: boolean;
}

function _CameraFeed({
  onReady,
  loading,
  stream,
  error,
  screenCaptureEnded,
  onRetryScreenCapture,
  isScreenCapture,
}: _CameraFeedProps) {
  const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  const mediaDevicesSupportError = hasGetUserMedia
    ? null
    : new Error('mediaDevices is not supported');

  const resolvedError = mediaDevicesSupportError || error || null;

  if (screenCaptureEnded && stream) {
    return (
      <div className={cx(cssViewfinderLiked)}>
        <div className={cssScreenCaptureEndedMessage}>
          <span>Screen capture ended</span>
          <button
            className={cssRetryButton}
            onClick={onRetryScreenCapture}
          >
            Select Screen
          </button>
        </div>
        <CameraVideo
          className={cssViewFinder}
          stream={stream}
          onReady={onReady}
        />
      </div>
    );
  }

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
    if (isScreenCapture) {
      return (
        <div className={cx(cssViewfinderLiked)}>
          <button
            className={cssRetryButton}
            onClick={onRetryScreenCapture}
          >
            Select Screen
          </button>
        </div>
      );
    }
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
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  background: 'stone.900',
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

const cssScreenCaptureEndedMessage = css({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  zIndex: 10,
  color: 'white',
  fontSize: '1rem',
  fontWeight: '500',
  textShadow: '0 1px 3px rgba(0,0,0,0.8)',
});

const cssRetryButton = css({
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
  fontWeight: '600',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: 'black',
  border: 'none',
  borderRadius: 'md',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'white',
  },
});
