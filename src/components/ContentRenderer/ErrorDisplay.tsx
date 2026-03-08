import { css, cx } from '~styled-system/css';
import { AppError, ErrorCode } from '../../lib/errors';

interface ErrorDisplayProps {
  error: AppError;
  className?: string;
}

export default function ErrorDisplay({ error, className }: ErrorDisplayProps) {
  const showReloadButton = error.code === ErrorCode.BARCODE_DETECTOR_NOT_SUPPORTED;

  return (
    <div className={cx(cssWrapper, className)}>
      <div className={cssContent}>
        <pre className={cssText}>{error.message}</pre>
        {error.recommendation && <pre className={cssRecommendation}>{error.recommendation}</pre>}
        {showReloadButton && (
          <button
            className={cssButton}
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        )}
      </div>
    </div>
  );
}

const cssWrapper = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  minHeight: 0,
  '@media(orientation: landscape)': {
    gap: 4,
  },
});

const cssContent = css({
  paddingY: 4,
  paddingX: 4,
  borderRadius: 'lg',
  background: 'stone.950',
  width: 'full',
  overflow: 'auto',
  overscrollBehavior: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  alignItems: 'flex-end',
});

const cssText = css({
  wordBreak: 'break-word',
  color: 'red.500',
  textAlign: 'left',
  whiteSpace: 'pre-wrap',
});

const cssRecommendation = css({
  wordBreak: 'break-word',
  color: 'yellow.500',
  textAlign: 'left',
  whiteSpace: 'pre-wrap',
});

const cssButton = css({
  paddingY: 2,
  paddingX: 4,
  borderRadius: 'md',
  background: 'red.600',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
  border: 'none',
  _hover: {
    background: 'red.700',
  },
});
