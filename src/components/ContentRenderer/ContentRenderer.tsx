import { type QrReaderData } from '@/lib/barcodeScanner';
import { css, cx } from '~styled-system/css';
import ContentAction from './ContentAction';
import ContentCard from './ContentCard';
import ErrorDisplay from './ErrorDisplay';
import { useLastGoodValue } from './useLastGoodValue';

interface ContentRendererProps {
  data: QrReaderData | null;
  className?: string;
}

function checkIsUrl(data: string): boolean {
  try {
    new URL(data);
    return true;
  } catch {
    return false;
  }
}

export default function ContentRenderer({ data, className }: ContentRendererProps) {
  const error = data?.error;
  const d = data?.data?.rawValue;
  const value = useLastGoodValue(d);
  const isUrl = value ? checkIsUrl(value) : false;

  if (error) {
    return (
      <ErrorDisplay
        className={className}
        error={error}
      />
    );
  }

  if (!value) {
    return (
      <div className={cx(cssWrapper, css({}), className)}>
        <ContentCard
          className={cx(cssTop, css({ color: 'gray', fontStyle: 'italic' }))}
          value={'Scan a QR Code...'}
        />
      </div>
    );
  }

  return (
    <div className={cx(cssWrapper, className)}>
      <ContentCard
        className={cssTop}
        value={value}
        isUrl={isUrl}
      />
      <ContentAction
        className={cssBottom}
        value={value}
        isUrl={isUrl}
      />
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

const cssTop = css({
  flexGrow: 1,
  flexShrink: 0,
  minHeight: 0,
  flexBasis: 0,
  '@media(orientation: landscape)': {
    flexBasis: 'auto',
    order: 2,
  },
});
const cssBottom = css({
  flexGrow: 0,
  flexShrink: 1,
  minHeight: 0,
  '@media(orientation: landscape)': {
    order: 1,
  },
});
