import { useState } from 'react';
import { css, cx } from '~styled-system/css';
import { LinkIcon, TextIcon, WrapIcon, NoWrapIcon } from './Icons';

interface ContentCardProps {
  value: string;
  isUrl?: boolean;
  className?: string;
}

export default function ContentCard({ value, isUrl = false, className }: ContentCardProps) {
  const [wrap, setWrap] = useState(true);

  return (
    <div className={cx(cssCard, className)}>
      <div className={cssCardHeader}>
        <span className={cssIcon}>{isUrl ? <LinkIcon /> : <TextIcon />}</span>
        <span>{isUrl ? 'URL' : 'Text'}</span>

        {!isUrl && (
          <button
            className={cssToggle}
            onClick={() => setWrap(!wrap)}
            aria-label={wrap ? 'Disable text wrap' : 'Enable text wrap'}
          >
            <span className={cssToggleIcon}>{wrap ? <WrapIcon /> : <NoWrapIcon />}</span>
          </button>
        )}
      </div>

      <div className={cssContent}>
        {isUrl ? (
          <a
            className={cssLink}
            href={value}
            target="_blank"
            rel="noopener noreferrer"
          >
            {value}
          </a>
        ) : (
          <pre className={cx(cssText, wrap ? cssTextWrap : cssTextNoWrap)}>{value}</pre>
        )}
      </div>
    </div>
  );
}

const cssCard = css({
  backgroundColor: 'neutral.900',
  borderRadius: 'lg',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'zinc.700',
  width: 'full',
  overflow: 'hidden',
  opacity: 0.95,
});

const cssCardHeader = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  padding: '2.5',
  paddingLeft: '3.5',
  paddingRight: '3.5',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'zinc.700',
  fontSize: 'xs',
  fontWeight: 'semibold',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'white',
  opacity: 0.4,
});

const cssIcon = css({
  width: '3.5',
  height: '3.5',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    width: 'full',
    height: 'full',
  },
});

const cssToggle = css({
  marginLeft: 'auto',
  padding: '1',
  background: 'transparent',
  border: 'none',
  borderRadius: 'sm',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  transition: 'all 0.15s ease',
  '@media(hover: hover)': {
    _hover: {
      backgroundColor: 'white',
      opacity: 0.1,
      color: 'white',
    },
  },
});

const cssToggleIcon = css({
  width: '3.5',
  height: '3.5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    width: 'full',
    height: 'full',
  },
});

const cssContent = css({
  paddingY: 6,
  paddingX: 3.5,
  overflow: 'auto',
});

const cssText = css({
  fontSize: 'sm',
  lineHeight: 'relaxed',
  color: 'white',
  margin: 0,
  fontFamily: 'mono',
});

const cssTextWrap = css({
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
});

const cssTextNoWrap = css({
  wordBreak: 'normal',
  whiteSpace: 'pre',
});

const cssLink = css({
  fontSize: 'sm',
  lineHeight: 'relaxed',
  color: 'blue.300',
  textDecoration: 'none',
  wordBreak: 'break-all',
  fontFamily: 'mono',
  display: 'block',
  '@media(hover: hover)': {
    _hover: {
      textDecoration: 'underline',
      color: 'blue.200',
    },
  },
});
