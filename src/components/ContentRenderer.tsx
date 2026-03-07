import { type QRCode } from 'jsqr';
import { useRef } from 'react';
import { css } from '~styled-system/css';

interface ContentRendererProps {
  data: QRCode | null;
}

function isUrl(data: string): boolean {
  try {
    new URL(data);
    return true;
  } catch {
    return false;
  }
}

export default function ContentRenderer({ data: _data }: ContentRendererProps) {
  const lastGoodData = useRef('');
  if (_data && _data.data) {
    lastGoodData.current = _data.data;
    if (navigator.vibrate) {
      navigator.vibrate([20]);
    }
  }

  const data = lastGoodData.current;
  if (!data) return null;

  const url = isUrl(data);

  return (
    <>
      <div
        className={cssIndicator}
        key={_data ? _data.location.topLeftCorner.x : 'idle'}
      />
      <div className={cssWrapper}>
        <div className={cssContent}>
          {url ? (
            <a
              className={`${cssContentAnchor} ${cssContentText}`}
              href={data}
              target="_blank"
              rel="noopener noreferrer"
            >
              {data}
            </a>
          ) : (
            <pre className={cssContentText}>{data}</pre>
          )}
        </div>
      </div>
    </>
  );
}

const cssWrapper = css({
  padding: 2,
  marginTop: 2,
});

const cssContent = css({
  padding: 4,
  borderRadius: 'lg',
  background: 'stone.950',
});

const cssIndicator = css({
  borderColor: 'green.800',
  borderStyle: 'dashed',
  borderWidth: 2,
  width: 'full',
  opacity: 0,
  animation: 'successIndicator 0.25s ease',
});

const cssContentText = css({});

const cssContentAnchor = css({
  display: 'inline-block',
  fontSize: '1.25em',
  wordBreak: 'break-word',
  lineHeight: '1.25',
  textDecoration: 'none',
  color: 'blue.800',
  _active: {
    color: 'blue.700',
  },
});
