import { css } from '../../styled-system/css';

interface ContentRendererProps {
  data: string | null;
}

const cssContent = css({ padding: '1em' });

const cssContentText = css({
  boxShadow: '4px 4px 32px 0 rgba(0,0,0,0.25)',
  padding: '1em',
  marginBottom: '2em',
});

const cssContentAnchor = css({
  display: 'inline-block',
  fontSize: '1.25em',
  wordBreak: 'break-word',
  lineHeight: '1.25',
  textDecoration: 'none',
});

function isUrl(data: string): boolean {
  try {
    new URL(data);
    return true;
  } catch {
    return false;
  }
}

export default function ContentRenderer({ data }: ContentRendererProps) {
  if (!data) return null;

  const url = isUrl(data);

  return (
    <div className={cssContent}>
      {url ? (
        <a
          className={`${cssContentAnchor} ${cssContentText}`}
          href={data}
          target="_blank"
          rel="noopener"
        >
          {data}
        </a>
      ) : (
        <div className={cssContentText}>{data}</div>
      )}
    </div>
  );
}
