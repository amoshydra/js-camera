import { ChangeEvent, useEffect, useState } from 'react';
import { css } from '~styled-system/css';
import { VideoStreamConstrain } from './ConfigurationStorage';

interface CameraStreamConfiguratorMenuProps {
  className?: string;
  value: VideoStreamConstrain;
  onUpdateModelValue?: (value: VideoStreamConstrain) => void;
  onClose?: () => void;
}

const extractOrGetFirst = <T,>(itemOrArrayOfItems: T | T[]): T =>
  Array.isArray(itemOrArrayOfItems) ? itemOrArrayOfItems[0] : itemOrArrayOfItems;

const extractConfig = <T extends MediaTrackConstraints>(
  constrain: undefined | T | boolean,
  key: keyof T,
): string | null => {
  if (typeof constrain !== 'object') return null;

  const firstDeviceId = extractOrGetFirst(constrain[key]);

  if (!firstDeviceId) return null;

  if (typeof firstDeviceId === 'string') return firstDeviceId;

  return extractOrGetFirst(
    (firstDeviceId as ConstrainDOMStringParameters).exact ??
      (firstDeviceId as ConstrainDOMStringParameters).ideal ??
      null,
  );
};

export default function CameraStreamConfiguratorMenu({
  className,
  value,
  onUpdateModelValue,
  onClose,
}: CameraStreamConfiguratorMenuProps) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceList) => {
      setDevices(deviceList.filter(({ kind }) => kind === 'videoinput'));
    });
  }, []);

  const selectedDeviceId = extractConfig(value as VideoStreamConstrain, 'deviceId');

  const handleInput = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectEl = event.currentTarget;
    onUpdateModelValue?.({
      ...(value as object),
      deviceId: selectEl.value,
    } as VideoStreamConstrain);
  };

  return (
    <div className={`${cssWrapper} ${className || ''}`}>
      <button
        onClick={onClose}
        className={cssButton}
      >
        ❌
      </button>

      <form className={css({ display: 'grid', gap: 4 })}>
        <label className={cssFieldGroup}>
          <h5>Video source</h5>
          <select
            className={cssInput}
            onChange={handleInput}
          >
            <option
              key="default"
              value=""
              selected={!selectedDeviceId}
            >
              Choose a device
            </option>
            {devices.map((device) => (
              <option
                key={device.deviceId}
                value={device.deviceId}
                selected={selectedDeviceId === device.deviceId}
              >
                {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
              </option>
            ))}
          </select>
        </label>
      </form>
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
});

const cssInput = css({
  maxWidth: '100%',
  padding: '0.6rem 0.2rem',
});

const cssFieldGroup = css({
  display: 'grid',
  rowGap: 2,
});
