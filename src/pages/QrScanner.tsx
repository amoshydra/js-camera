import ScannedIndicator from '@/components/ScannedIndicator';
import { type DetectedBarcode } from '@/lib/barcodeScanner';
import { useState } from 'react';
import { css } from '~styled-system/css';
import ContentRenderer from '../components/ContentRenderer/ContentRenderer';
import QrInput from '../components/QrInput/QrInput';

interface QrScannerProps {
  disabled?: boolean;
}

export default function QrScanner({ disabled = false }: QrScannerProps) {
  const [data, setData] = useState<DetectedBarcode | null>(null);

  return (
    <>
      <ScannedIndicator data={data} />
      <div className={cssWrapper}>
        <QrInput
          disabled={disabled}
          onChange={setData}
          className={cssTop}
        />
        <ContentRenderer
          data={data}
          className={cssBottom}
        />
      </div>
    </>
  );
}

const cssWrapper = css({
  marginTop: 'env(safe-area-inset-top)',
  marginBottom: 'env(safe-area-inset-bottom)',
  padding: 4,
  display: 'flex',
  flexDirection: 'column',
  height: 'full',
  minHeight: 0,
});
const cssTop = css({
  flexGrow: 0,
  flexShrink: 1,
});
const cssBottom = css({
  flexGrow: 1,
  flexShrink: 0,
});
