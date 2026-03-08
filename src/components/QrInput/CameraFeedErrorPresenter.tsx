import { css, cx } from '~styled-system/css';

interface CameraFeedErrorPresenterProps {
  error?: Error;
  className?: string;
}

const cssWrapper = css({
  backgroundColor: 'red.950',
});

const cssIcon = css({
  fontSize: 'min(20vw, 5em)',
});

const cssFriendlyMessage = css({
  marginBottom: '0.5em',
  fontWeight: 'bold',
});

const cssErrorMessage = css({
  fontFamily: 'monospace',
});

export default function CameraFeedErrorPresenter({
  error,
  className,
}: CameraFeedErrorPresenterProps) {
  return (
    <div className={cx(cssWrapper, className)}>
      <div className={cssIcon}>😟</div>
      <div className={cssFriendlyMessage}>I cannot access to the camera.</div>
      <div className={cssErrorMessage}>{error?.message}</div>
    </div>
  );
}
