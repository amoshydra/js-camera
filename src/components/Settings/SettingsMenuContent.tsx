import { css } from '~styled-system/css';
import { VideoStreamConstrain } from '@/components/QrInput/ConfigurationStorage';
import { CloseIcon } from '@/components/QrInput/Icons';
import ScannerSettingsSection from './sections/ScannerSettingsSection';
import CameraSettingsSection from './sections/CameraSettingsSection';
import SettingsFooter from './SettingsFooter';

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

        <CameraSettingsSection
          value={cameraValue}
          onUpdateModelValue={onCameraValueChange}
        />
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
