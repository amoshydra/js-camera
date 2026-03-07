import { type QRCode } from 'jsqr';
import { css } from '~styled-system/css';
import ContentAction from './ContentAction';
import ContentCard from './ContentCard';
import { useLastGoodValue } from './useLastGoodValue';

interface ContentRendererProps {
  data: QRCode | null;
}

function checkIsUrl(data: string): boolean {
  try {
    new URL(data);
    return true;
  } catch {
    return false;
  }
}

export default function ContentRenderer({ data }: ContentRendererProps) {
  const value = useLastGoodValue(data?.data);
  const isUrl = value ? checkIsUrl(value) : false;

  return (
    <div className={cssWrapper}>
      <div
        className={cssIndicator}
        key={data ? data.location.topLeftCorner.x : 'idle'}
      />

      {value && (
        <div>
          <ContentAction
            value={value}
            isUrl={isUrl}
          />
          <ContentCard
            value={value}
            isUrl={isUrl}
          />
        </div>
      )}
    </div>
  );
}

const cssWrapper = css({
  display: 'grid',
  gap: 2,
});

const cssIndicator = css({
  borderColor: 'green.800',
  borderStyle: 'dashed',
  borderWidth: 2,
  width: 'full',
  opacity: 0,
  animation: 'successIndicator 0.25s ease',
});
