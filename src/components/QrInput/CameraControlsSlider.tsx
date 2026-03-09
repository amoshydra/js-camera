import { css } from '~styled-system/css';

interface CameraControlsSliderProps {
  min: number;
  max: number;
  zoomLevel: number;
  onZoomLevelChange: (zoom: number) => Promise<boolean>;
}

export default function CameraControlsSlider({
  min,
  max,
  zoomLevel,
  onZoomLevelChange,
}: CameraControlsSliderProps) {
  return (
    <div className={cssZoom}>
      <input
        type="range"
        min={min}
        max={max}
        step={0.1}
        value={zoomLevel ?? 1}
        onChange={(e) => onZoomLevelChange?.(parseFloat(e.currentTarget.value))}
        className={cssZoomSlider}
      />
      <span className={cssZoomValue}>{zoomLevel?.toFixed(1)}x</span>
    </div>
  );
}

const cssZoom = css({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  flex: 1,
  justifyContent: 'center',
});

const cssZoomSlider = css({
  width: '100%',
  accentColor: 'blue.500',
});

const cssZoomValue = css({
  fontSize: '0.875rem',
  color: 'gray.300',
  minWidth: '2.5rem',
  textAlign: 'center',
});
