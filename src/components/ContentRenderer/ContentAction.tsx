import { css, cx } from '~styled-system/css';
import { styled } from '~styled-system/jsx';

interface ContentActionProps {
  value: string;
  isUrl: boolean;
  className?: string;
}

export default function ContentAction({ value, isUrl, className }: ContentActionProps) {
  const canShare = navigator.canShare;
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
  };
  const handleShare = () => {
    const key: keyof ShareData = isUrl ? 'url' : 'text';
    navigator.share({
      [key]: value,
    });
  };

  return (
    <div className={cx(cssWrapper, className)}>
      <Button onClick={handleCopy}>Copy</Button>
      {canShare && <Button onClick={handleShare}>Share</Button>}
    </div>
  );
}

const cssWrapper = css({
  padding: 2,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: 2,
});

const Button = styled('button', {
  base: {
    display: 'block',
    paddingY: 2,
    paddingX: 8,
    background: 'stone.900',
    borderRadius: 'lg',
    '@media(hover: hover)': {
      _hover: {
        background: 'stone.800',
      },
    },
    _active: {
      background: 'stone.800',
    },
  },
});
