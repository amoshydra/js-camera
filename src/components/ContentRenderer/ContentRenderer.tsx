import { type QRCode } from 'jsqr';
import { css, cx } from '~styled-system/css';
import ContentAction from './ContentAction';
import ContentCard from './ContentCard';
import { useLastGoodValue } from './useLastGoodValue';

interface ContentRendererProps {
  data: QRCode | null;
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
  const d = data?.data;
  const value = useLastGoodValue(d);
  const isUrl = value ? checkIsUrl(value) : false;

  if (!value) return;

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
  marginTop: 2,
  gap: 2,
  minHeight: 0,
});

const cssTop = css({
  flexGrow: 1,
  flexShrink: 0,
  minHeight: 0,
  flexBasis: 0,
});
const cssBottom = css({
  flexGrow: 0,
  flexShrink: 1,
  minHeight: 0,
});
