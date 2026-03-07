import { type QRCode } from 'jsqr';
import { useState } from 'react';
import { css } from '~styled-system/css';
import ContentRenderer from '../components/ContentRenderer/ContentRenderer';
import QrInput from '../components/QrInput/QrInput';

interface QrScannerProps {
  disabled?: boolean;
}

export default function QrScanner({ disabled = false }: QrScannerProps) {
  const [data, setData] = useState<QRCode | null>(null);

  return (
    <div className={cssWrapper}>
      <QrInput
        disabled={disabled}
        onChange={setData}
      />
      <ContentRenderer data={data} />
    </div>
  );
}

const cssWrapper = css({
  paddingTop: 'env(safe-area-inset-top)',
});
