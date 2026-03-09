import { useRef, useState } from 'react';
import { css, cx } from '~styled-system/css';
import { Button } from './Style';
import { CopyIcon, CheckIcon, ShareIcon, UploadIcon } from './Icons';

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
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fail - user will see nothing happened
    }
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
        <Button onClick={handleFileUpload}>
          <span className={cssIcon}>
            <UploadIcon />
          </span>
          Upload
        </Button>
      </div>

      <div className={cssButtonGroup}>
        <Button onClick={handleCopy}>
          <span className={cssIcon}>{copied ? <CheckIcon /> : <CopyIcon />}</span>
          {copied ? 'Copied!' : 'Copy'}
        </Button>
        {canShare && (
          <Button onClick={handleShare}>
            <span className={cssIcon}>
              <ShareIcon />
            </span>
            Share
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={css({ display: 'none' })}
      />
    </div>
  );
}

const cssWrapper = css({
  display: 'flex',
  justifyContent: 'space-between',
  gap: 2,
  width: 'full',
});

const cssButtonGroup = css({
  display: 'flex',
  gap: 2,
});

const cssIcon = css({
  width: 4,
  height: 4,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    width: 'full',
    height: 'full',
  },
});
