import { css } from '~styled-system/css';
import { VideoStreamConstrain } from '@/components/QrInput/ConfigurationStorage';
import { CloseIcon } from '@/components/QrInput/Icons';
import { settingsStore } from './SettingsStore';
import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import ScannerSettingsSection from './sections/ScannerSettingsSection';
import CameraSettingsSection from './sections/CameraSettingsSection';
import ExperimentalSettingsSection from './sections/ExperimentalSettingsSection';
import SettingsFooter from './SettingsFooter';

const LazyAiSettingsSection = lazy(() => import('@/experimental/features/ai/AiSettingsSection'));

interface SettingsMenuContentProps {
  className?: string;
  cameraValue: VideoStreamConstrain;
  onCameraValueChange?: (value: VideoStreamConstrain) => void;
  onClose?: () => void;
}

export default function SettingsMenuContent({
  className,
  cameraValue,
  onCameraValueChange,
  onClose,
}: SettingsMenuContentProps) {
  const [enableAiMode, setEnableAiMode] = useState(() => settingsStore.settings.enableAiMode);
  const setEnableAiModeRef = useRef(setEnableAiMode);
  setEnableAiModeRef.current = setEnableAiMode;

  useEffect(() => {
    const handleSettingsChange = () => {
      setEnableAiModeRef.current(settingsStore.settings.enableAiMode);
    };
    window.addEventListener('js-camera-settings-change', handleSettingsChange);
    return () => window.removeEventListener('js-camera-settings-change', handleSettingsChange);
  }, []);

  return (
    <div className={`${cssWrapper} ${className || ''}`}>
      <button
        onClick={onClose}
        className={cssButton}
        aria-label="Close settings"
      >
        <CloseIcon />
      </button>

      <div className={cssContent}>
        <ScannerSettingsSection />

        <div className={cssDivider} />

        <ExperimentalSettingsSection />

        <div className={cssDivider} />

        <CameraSettingsSection
          value={cameraValue}
          onUpdateModelValue={onCameraValueChange}
        />

        {enableAiMode && (
          <>
            <div className={cssDivider} />
            <Suspense fallback={null}>
              <LazyAiSettingsSection />
            </Suspense>
          </>
        )}

        <SettingsFooter />
      </div>
    </div>
  );
}

const cssWrapper = css({
  padding: '1em',
  paddingTop: '2em',
  paddingBottom: '2em',
});

const cssButton = css({
  position: 'absolute',
  top: '0',
  right: '0',
  padding: '0.5rem',
  fontSize: '1rem',
  backgroundColor: 'rgba(0, 0, 0, 0)',
  border: 'none',
  margin: 2,
  color: 'rgba(255, 255, 255, 0.7)',
  cursor: 'pointer',
  '&:hover': {
    color: 'white',
  },
});

const cssContent = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});

const cssDivider = css({
  height: '1px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
});
