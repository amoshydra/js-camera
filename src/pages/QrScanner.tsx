import { type QRCode } from 'jsqr';
import { useState } from 'react';
import ContentRenderer from '../components/ContentRenderer';
import QrInput from '../components/QrInput/QrInput';

interface QrScannerProps {
  disabled?: boolean;
}

export default function QrScanner({ disabled = false }: QrScannerProps) {
  const [data, setData] = useState<QRCode | null>(null);

  return (
    <div>
      <QrInput
        disabled={disabled}
        onChange={setData}
      />
      <ContentRenderer data={data} />
    </div>
  );
}
