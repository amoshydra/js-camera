import { css } from '~styled-system/css';
import { styled } from '~styled-system/jsx';

interface ContentActionProps {
  value: string;
  isUrl: boolean;
}

export default function ContentAction({ value, isUrl }: ContentActionProps) {
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
    <div className={cssWrapper}>
      <Button onClick={handleCopy}>Copy</Button>
      {canShare && <Button onClick={handleShare}>Share</Button>}
    </div>
  );
}

const cssWrapper = css({
  padding: 2,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 4,
});

const Button = styled('button', {
  base: {
    paddingY: 2,
    paddingX: 4,
    background: 'stone.900',
    borderRadius: 'full',
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
