import { CSSProperties, KeyboardEvent, useEffect, useState } from 'react';
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
  const [touched, setTouched] = useState(false);
  const [z, setZ] = useState(zoomLevel);

  const zoomPercent = ((zoomLevel - min) / (max - min)) * 100;
  const stripePosition = zoomPercent * -970;

  const handleKeyDown = (e: KeyboardEvent) => {
    const step = 0.1;
    let newValue = zoomLevel;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        newValue = Math.max(min, zoomLevel - step);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        newValue = Math.min(max, zoomLevel + step);
        break;
      case 'Home':
        e.preventDefault();
        newValue = min;
        break;
      case 'End':
        e.preventDefault();
        newValue = max;
        break;
      default:
        return;
    }

    setZ(newValue);
    onZoomLevelChange(newValue);
  };

  useEffect(() => {
    const ac = new AbortController();

    document.addEventListener(
      'pointerup',
      () => {
        setTouched(false);
      },
      { signal: ac.signal },
    );

    document.addEventListener(
      'pointermove',
      (e) => {
        if (!touched) return;

        const v = Math.min(Math.max(min, z + e.movementX * 0.05), max);
        setZ(v);
        if (z !== v) {
          onZoomLevelChange(v);
          navigator.vibrate?.(1);
        }
      },
      { signal: ac.signal },
    );

    return () => {
      ac.abort();
    };
  });

  return (
    <div
      role="slider"
      aria-label="Zoom level"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={zoomLevel}
      aria-valuetext={`${zoomLevel.toFixed(2)}x zoom`}
      tabIndex={0}
      data-touched={touched}
      className={cssZoom}
      style={
        {
          backgroundPositionX: `calc(${stripePosition}%)`,
        } as CSSProperties
      }
      onPointerDownCapture={(e) => {
        setTouched(true);
        e.preventDefault();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      onKeyDown={handleKeyDown}
    >
      <span className={cssZoomValue}>{zoomLevel?.toFixed(2)}x</span>
    </div>
  );
}

const cssZoom = css({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  flex: 1,
  width: 'full',
  justifyContent: 'center',
  height: 12,
  borderRadius: 'md',
  userSelect: 'none',
  touchAction: 'manipulation',
  backgroundColor: 'stone.950',
  backgroundSize: '100% 100%',
  backgroundRepeat: 'repeat-x',
  color: 'rgba(255, 255, 255, 0.05)',
  transition: 'color 0.5s ease-in-out',
  backgroundImage: `repeating-linear-gradient(
      90deg,
      transparent,
      transparent 4px,
      currentColor 4px,
      currentColor 8px
    )`,
  [`&[data-touched="true"]`]: {
    backgroundColor: 'stone.950',
    color: 'rgba(255, 255, 255, 0.15)',
  },
  '&:focus': {
    outline: '2px solid',
    outlineColor: 'blue.400',
    outlineOffset: '2px',
  },
  '&:focus:not(:focus-visible)': {
    outline: 'none',
  },
});

const cssZoomValue = css({
  fontSize: '0.875rem',
  fontFamily: 'mono',
  color: 'gray.300',
  minWidth: '2.5rem',
  textAlign: 'center',
  pointerEvents: 'none',
});
