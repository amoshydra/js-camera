import { useRef } from 'react';
import { css, cx } from '~styled-system/css';
import { Button } from './Style';

interface ContentActionProps {
  value: string;
  isUrl: boolean;
  className?: string;
  onFileUpload?: (file: File) => void;
}

export default function ContentAction({
  value,
  isUrl,
  className,
  onFileUpload,
}: ContentActionProps) {
  const canShare = navigator.canShare;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
  };
  const handleShare = () => {
    const key: keyof ShareData = isUrl ? 'url' : 'text';
    navigator.share({
      [key]: value,
    });
  };

  const handleFileUpload = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload?.(file);
      e.target.value = '';
    }
  };

  return (
    <div className={cx(cssWrapper, className)}>
      <div className={cssButtonGroup}>
        <Button onClick={handleFileUpload}>Upload</Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={css({ display: 'none' })}
        />
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
