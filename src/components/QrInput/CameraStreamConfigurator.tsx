import { useState } from 'react';
import { css } from '../../../styled-system/css';
import { configStore } from './CameraStreamConfigurator.lib';
import CameraStreamConfiguratorMenu from './CameraStreamConfiguratorMenu';
import { VideoStreamConstrain } from './ConfigurationStorage';

interface CameraStreamConfiguratorProps {
  value?: VideoStreamConstrain;
  onUpdateModelValue?: (value: VideoStreamConstrain) => void;
}

export default function CameraStreamConfigurator({
  value,
  onUpdateModelValue,
}: CameraStreamConfiguratorProps) {
  const [showConfiguratorUi, setShowConfiguratorUi] = useState(false);

  const updateConfig = (config: VideoStreamConstrain) => {
    configStore.store(config);
    onUpdateModelValue?.(configStore.load());
  };

  return (
    <div className={cssWrapper}>
      <button
        onClick={() => setShowConfiguratorUi((v) => !v)}
        className={cssButton}
      >
        ⚙
      </button>

      {showConfiguratorUi && (
        <CameraStreamConfiguratorMenu
          className={cssConfigurator}
          value={value}
          onUpdateModelValue={updateConfig}
          onClose={() => setShowConfiguratorUi(false)}
        />
      )}
    </div>
  );
}

const cssWrapper = css({
  position: 'relative',
  right: '0',
  top: '0',
  zIndex: '10',
});

const cssButton = css({
  padding: '0.5rem',
  fontSize: '1rem',
  backgroundColor: 'rgba(0, 0, 0, 0)',
  border: 'none',
  margin: '0.4em',
});

const cssConfigurator = css({
  position: 'absolute',
  right: '0',
  top: '0',
  margin: '0.4em',
  width: 'calc(100vw - 0px - 0.8em)',
  boxSizing: 'border-box',
});
