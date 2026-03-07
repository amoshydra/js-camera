import CameraFeedErrorPresenter from './CameraFeedErrorPresenter';
import CameraStreamReceiver from './CameraStreamReceiver';
import CameraVideo from './CameraVideo';

export default function CameraFeed({
  onReady,
}: {
  _autoplay?: boolean;
  onReady?: (videoEl: HTMLVideoElement) => void;
}) {
  const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  const mediaDevicesSupportError = hasGetUserMedia
    ? null
    : new Error('mediaDevices is not supported');

  return (
    <CameraStreamReceiver
      renderSlot={(slotData: { stream: MediaStream | null; error: Error | null }) => (
        <>
          {mediaDevicesSupportError || slotData.error ? (
            <CameraFeedErrorPresenter
              error={mediaDevicesSupportError || slotData.error || undefined}
            />
          ) : (
            <CameraVideo
              stream={slotData.stream}
              onReady={onReady}
            />
          )}
        </>
      )}
    />
  );
}
