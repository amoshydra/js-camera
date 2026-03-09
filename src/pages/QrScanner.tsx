import ScannedIndicator from '@/components/ScannedIndicator';
import { type QrReaderData } from '@/lib/barcodeScanner';
import { useState } from 'react';
import { css } from '~styled-system/css';
import ContentRenderer from '../components/ContentRenderer/ContentRenderer';
import QrInput from '../components/QrInput/QrInput';

interface QrScannerProps {
  disabled?: boolean;
  initialData?: QrReaderData;
}

export default function QrScanner({ disabled = false, initialData }: QrScannerProps) {
  const [data, setData] = useState<QrReaderData>(
    initialData ?? {
      data: null,
      error: null,
      scannerType: 'native',
    },
  );

  return (
    <>
      <ScannedIndicator
        data={data.data}
        scannerType={data.scannerType}
      />
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
  height: 'full',
  minHeight: 0,
  flexDirection: 'column',
  gap: 2,
  '@media(orientation: landscape)': {
    flexDirection: 'row',
    maxWidth: '1200px',
    marginX: 'auto',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 8,
  },
});
const cssTop = css({
  flexGrow: 0,
  flexShrink: 1,
  '@media(orientation: landscape)': {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '50%',
  },
});
const cssBottom = css({
  flexGrow: 1,
  flexShrink: 0,
  '@media(orientation: landscape)': {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '50%',
  },
});
