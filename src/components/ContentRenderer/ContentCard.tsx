import { css, cx } from '~styled-system/css';

interface ContentCardProps {
  value: string;
  isUrl?: boolean;
  className?: string;
}

export default function ContentCard({ value, isUrl = false, className }: ContentCardProps) {
  return (
    <div className={cx(cssContent, className)}>
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
  );
}

const cssContent = css({
  borderRadius: 'lg',
  width: 'full',
  paddingY: 4,
  paddingX: 4,
  background: 'rgba(16, 16, 16, 0.9)',
});
const cssContentText = css({
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  fontSize: '1rem',
});

const cssContentAnchor = css({
  display: 'inline-block',
  fontSize: '1rem',
  wordBreak: 'break-word',
  lineHeight: '1.25',
  textDecoration: 'none',
  color: 'blue.800',
  _active: {
    color: 'blue.700',
  },
});
