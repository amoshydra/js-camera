import { css, cx } from '~styled-system/css';
import { AppError, ErrorCode } from '../../lib/errors';
import { ErrorIcon, ReloadIcon } from './Icons';

interface ErrorDisplayProps {
  error: AppError;
  className?: string;
}

export default function ErrorDisplay({ error, className }: ErrorDisplayProps) {
  const showReloadButton =
    error.code === ErrorCode.BARCODE_DETECTOR_NOT_SUPPORTED ||
    error.code === ErrorCode.BARCODE_DETECTION_FAILED;

  return (
    <div className={cx(cssWrapper, className)}>
      <div className={cssCard}>
        <div className={cssCardHeader}>
          <span className={cssIcon}>
            <ErrorIcon />
          </span>
          <span>Error</span>
        </div>

        <div className={cssContent}>
          <p className={cssMessage}>{error.message}</p>
          {error.recommendation && <p className={cssRecommendation}>{error.recommendation}</p>}
        </div>

        {showReloadButton && (
          <button
            className={cssButton}
            onClick={() => window.location.reload()}
          >
            <span className={cssButtonIcon}>
              <ReloadIcon />
            </span>
            Reload page
          </button>
        )}
      </div>
    </div>
  );
}

const cssWrapper = css({
  padding: '3',
});

const cssCard = css({
  backgroundColor: 'red.950',
  borderRadius: 'lg',
  border: '1px solid',
  borderColor: 'red.800',
  padding: '4',
  display: 'flex',
  flexDirection: 'column',
  gap: '3',
});

const cssCardHeader = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  fontSize: 'xs',
  fontWeight: 'semibold',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'red.300',
});

const cssIcon = css({
  width: '4',
  height: '4',
  color: 'red.500',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    width: 'full',
    height: 'full',
  },
});

const cssContent = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
});

const cssMessage = css({
  fontSize: 'sm',
  color: 'red.300',
  lineHeight: 'relaxed',
  margin: 0,
});

const cssRecommendation = css({
  fontSize: 'xs',
  color: 'yellow.400',
  lineHeight: 'relaxed',
  margin: 0,
});

const cssButton = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2',
  paddingY: '2.5',
  paddingX: '4',
  borderRadius: 'lg',
  fontSize: 'sm',
  fontWeight: 'semibold',
  backgroundColor: 'red.800',
  border: '1px solid',
  borderColor: 'red.700',
  color: 'red.300',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  marginTop: '1',
  opacity: 0.9,
  '@media(hover: hover)': {
    _hover: {
      opacity: 1,
    },
  },
});

const cssButtonIcon = css({
  width: '3.5',
  height: '3.5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    width: 'full',
    height: 'full',
  },
});
