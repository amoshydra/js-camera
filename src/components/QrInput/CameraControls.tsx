import { css } from '~styled-system/css';
import CameraControlsSlider from './CameraControlsSlider';

interface CameraControlsProps {
  torchEnabled?: boolean;
  zoomLevel?: number;
  capabilities?: MediaTrackCapabilities;
  applyTorch?: (enabled: boolean) => Promise<boolean>;
  applyZoom?: (zoom: number) => Promise<boolean>;
  onFlip?: () => void;
}

export default function CameraControls({
  torchEnabled,
  zoomLevel,
  capabilities,
  applyTorch,
  applyZoom,
  onFlip,
}: CameraControlsProps) {
  const hasZoom = capabilities && 'zoom' in capabilities;
  const hasTorch = capabilities && 'torch' in capabilities;

  const zoomMin = hasZoom
    ? typeof capabilities.zoom === 'number'
      ? capabilities.zoom
      : ((capabilities.zoom as { min: number }).min ?? 1)
    : 1;

  const zoomMax = hasZoom
    ? typeof capabilities.zoom === 'number'
      ? capabilities.zoom
      : ((capabilities.zoom as { max: number }).max ?? 1)
    : 1;

  return (
    <div className={cssWrapper}>
      <button
        className={cssButton}
        onClick={() => applyTorch?.(!torchEnabled)}
        disabled={!hasTorch}
        title={hasTorch ? 'Toggle flashlight' : 'Flashlight not supported'}
      >
        {torchEnabled ? '🔦' : '💡'}
      </button>

      {hasZoom && (
        <CameraControlsSlider
          min={zoomMin}
          max={zoomMax}
          zoomLevel={zoomLevel ?? 1}
          onZoomLevelChange={(z) => applyZoom(z)}
        />
      )}

      {!hasZoom && <div className={cssSpacer} />}

      <button
        className={cssButton}
        onClick={onFlip}
        title="Switch camera"
      >
        🔄
      </button>
    </div>
  );
}

const cssWrapper = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: 'md',
  gap: 2,
});

const cssButton = css({
  padding: '0.5rem',
  fontSize: '1.25rem',
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: 'md',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '2.5rem',
  minHeight: '2.5rem',
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  '&:hover:not(:disabled)': {
    backgroundColor: 'stone.700',
  },
});

const cssSpacer = css({
  flex: 1,
});
