import { css } from '~styled-system/css';

interface ContentCardProps {
  value: string;
  isUrl: boolean;
}

export default function ContentCard({ value, isUrl }: ContentCardProps) {
  return (
    <div className={cssWrapper}>
      <div className={cssContent}>
        {isUrl ? (
          <a
            className={`${cssContentAnchor} ${cssContentText}`}
            href={value}
            target="_blank"
            rel="noopener noreferrer"
          >
            {value}
          </a>
        ) : (
          <pre className={cssContentText}>{value}</pre>
        )}
      </div>
    </div>
  );
}

const cssWrapper = css({
  padding: 2,
});

const cssContent = css({
  padding: 4,
  borderRadius: 'lg',
  background: 'stone.950',
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
