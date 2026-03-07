import { type QRCode } from 'jsqr';
import { css } from '~styled-system/css';

interface ContentRendererProps {
  data: QRCode | null;
}

export default function ScannedIndicator({ data }: ContentRendererProps) {
  return (
    <div
      className={cssIndicator}
      key={data ? data.location.topLeftCorner.x : 'idle'}
    />
  );
}

const cssIndicator = css({
  position: 'fixed',
  inset: 0,
  boxShadow: 'inset 0px 0px 4rem 0 rgba(255, 255, 255, 0.125)',
  width: 'full',
  height: 'full',
  pointerEvents: 'none',
  boxSizing: 'border-box',
  opacity: 0,
  animation: 'successIndicator 0.5s ease',
});
