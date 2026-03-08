import { type DetectedBarcode } from '@/lib/barcodeScanner';
import { css } from '~styled-system/css';

interface ContentRendererProps {
  data: DetectedBarcode | null;
  scannerType?: 'native' | 'legacy';
}

export default function ScannedIndicator({ data, scannerType = 'native' }: ContentRendererProps) {
  const pulseColor = scannerType === 'legacy' ? '147, 51, 234' : '255, 255, 255';

  return (
    <div
      className={cssIndicator}
      key={data ? data.cornerPoints[0]?.x : 'idle'}
      style={{ '--pulse-color': pulseColor } as React.CSSProperties}
    />
  );
}

const cssIndicator = css({
  position: 'fixed',
  inset: 0,
  boxShadow: 'inset 0px 0px 4rem 0 rgba(var(--pulse-color), 0.125)',
  width: 'full',
  height: 'full',
  pointerEvents: 'none',
  boxSizing: 'border-box',
  opacity: 0,
  animation: 'successIndicator 0.5s ease',
});
