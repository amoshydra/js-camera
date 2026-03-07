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
        <div className={cssContentText}>{data}</div>
      )}
    </div>
  );
}

const cssContent = css({ padding: '1em' });

const cssContentText = css({
  marginBottom: '2em',
});

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
