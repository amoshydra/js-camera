import { useState } from 'react';
import { css, cx } from '~styled-system/css';
import Dialog from '../Dialog/Dialog';
import { configStore } from './CameraStreamConfigurator.lib';
import CameraStreamConfiguratorMenu from './CameraStreamConfiguratorMenu';
import { VideoStreamConstrain } from './ConfigurationStorage';
import { SettingsIcon } from './Icons';
import { useServiceWorker } from '@/hooks/useServiceWorker';

interface CameraStreamConfiguratorProps {
  value?: VideoStreamConstrain;
  onUpdateModelValue?: (value: VideoStreamConstrain) => void;
  className?: string;
}

export default function CameraStreamConfigurator({
  value,
  onUpdateModelValue,
  className,
}: CameraStreamConfiguratorProps) {
  const [showConfiguratorUi, setShowConfiguratorUi] = useState(false);
  const { needRefresh } = useServiceWorker();

  const updateConfig = (config: VideoStreamConstrain) => {
    configStore.store(config);
    onUpdateModelValue?.(configStore.load());
  };

  return (
    <div className={cx(cssWrapper, className)}>
      <button
        onClick={() => setShowConfiguratorUi((v) => !v)}
        className={cssButton}
        aria-label="Open camera settings"
      >
        <SettingsIcon />
        {needRefresh && <span className={cssPulseDot} />}
      </button>

      {showConfiguratorUi && (
        <Dialog
          className={cssConfigurator}
          open={showConfiguratorUi}
          onClose={() => setShowConfiguratorUi(false)}
        >
          <CameraStreamConfiguratorMenu
            value={value}
            onUpdateModelValue={updateConfig}
            onClose={() => setShowConfiguratorUi(false)}
          />
        </Dialog>
      )}
    </div>
  );
}

const cssWrapper = css({
  position: 'absolute',
  right: '0',
  top: '0',
  zIndex: '1',
});

const cssButton = css({
  padding: '0.5rem',
  fontSize: '1rem',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  border: 'none',
  margin: '0.4em',
  borderRadius: 'md',
  color: 'white',
});

const cssConfigurator = css({
  width: 'full',
  boxSizing: 'border-box',
  placeSelf: 'start end',
  margin: 4,
  borderRadius: 'sm',
  color: 'white',
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  boxShadow: '8px 8px 32px rgba(0,0,0,0.2)',
});

const cssPulseDot = css({
  position: 'absolute',
  top: '4px',
  right: '4px',
  width: '8px',
  height: '8px',
  backgroundColor: 'green.500',
  borderRadius: 'full',
  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
});
