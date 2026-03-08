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
  paddingY: 4,
  paddingX: 4,
  borderRadius: 'lg',
  background: 'stone.950',
  width: 'full',
  overflow: 'auto',
  overscrollBehavior: 'none',
});

const cssContentText = css({
  wordBreak: 'break-word',
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
