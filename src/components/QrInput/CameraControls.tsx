import { css, cx } from '~styled-system/css';
import CameraControlsSlider from './CameraControlsSlider';
import { FlashlightOnIcon, FlashlightOffIcon, FlipCameraIcon } from './Icons';

interface CameraControlsProps {
  torchEnabled?: boolean;
  zoomLevel?: number;
  capabilities?: MediaTrackCapabilities;
  applyTorch?: (enabled: boolean) => Promise<boolean>;
  applyZoom?: (zoom: number) => Promise<boolean>;
  onFlip?: () => void;
  className: string;
}

export default function CameraControls({
  torchEnabled,
  zoomLevel,
  capabilities,
  applyTorch,
  applyZoom,
  onFlip,
  className,
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
    <div className={cx(className, cssWrapper)}>
      <button
        className={cssButton}
        onClick={() => applyTorch?.(!torchEnabled)}
        disabled={!hasTorch}
        title={hasTorch ? 'Toggle flashlight' : 'Flashlight not supported'}
        aria-label={torchEnabled ? 'Turn off flashlight' : 'Turn on flashlight'}
      >
        {torchEnabled ? <FlashlightOnIcon /> : <FlashlightOffIcon />}
      </button>

      {hasZoom && (
        <CameraControlsSlider
          min={zoomMin}
          max={zoomMax}
          zoomLevel={zoomLevel ?? 1}
          onZoomLevelChange={(z) => applyZoom(z)}
        />
      )}

      <button
        className={cssButton}
        onClick={onFlip}
        title="Switch camera"
        aria-label="Switch camera"
      >
        <FlipCameraIcon />
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
  height: 12,
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
