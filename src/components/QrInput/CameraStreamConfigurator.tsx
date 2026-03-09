import { useState } from 'react';
import { css, cx } from '~styled-system/css';
import Dialog from '../Dialog/Dialog';
import { configStore } from './CameraStreamConfigurator.lib';
import CameraStreamConfiguratorMenu from './CameraStreamConfiguratorMenu';
import { VideoStreamConstrain } from './ConfigurationStorage';

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

  const updateConfig = (config: VideoStreamConstrain) => {
    configStore.store(config);
    onUpdateModelValue?.(configStore.load());
  };

  return (
    <div className={cx(cssWrapper, className)}>
      <button
        onClick={() => setShowConfiguratorUi((v) => !v)}
        className={cssButton}
      >
        ⚙
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
  margin: 2,
  borderRadius: 'sm',
  color: 'white',
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  boxShadow: '8px 8px 32px rgba(0,0,0,0.2)',
});
