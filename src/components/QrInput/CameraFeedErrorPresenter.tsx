import { css } from '../../../styled-system/css';

interface CameraFeedErrorPresenterProps {
  error?: Error;
}

const cssWrapper = css({
  backgroundColor: 'rgba(255, 2, 2, 0.1)',
  paddingTop: '3em',
  paddingBottom: '3em',
  boxSizing: 'border-box',
  textAlign: 'center',
});

const cssIcon = css({
  fontSize: '5em',
  marginBottom: '0.5em',
});

const cssFriendlyMessage = css({
  marginBottom: '0.5em',
  fontWeight: 'bold',
});

const cssErrorMessage = css({
  fontFamily: 'monospace',
});

export default function CameraFeedErrorPresenter({ error }: CameraFeedErrorPresenterProps) {
  return (
    <div className={cssWrapper}>
      <div className={cssIcon}>😟</div>
      <div className={cssFriendlyMessage}>I cannot access to the camera.</div>
      <div className={cssErrorMessage}>{error?.message}</div>
    </div>
  );
}
