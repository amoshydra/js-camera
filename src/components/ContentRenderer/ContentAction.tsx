import { css, cx } from '~styled-system/css';
import { Button } from './Style';

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
      <div className={cssButtonGroup}>
        <Button onClick={handleCopy}>File</Button>
      </div>
      <div className={cssButtonGroup}>
        <Button onClick={handleCopy}>Copy</Button>
        {canShare && <Button onClick={handleShare}>Share</Button>}
      </div>
    </div>
  );
}

const cssWrapper = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 4,
});

const cssButtonGroup = css({
  display: 'flex',
  gap: 2,
});
