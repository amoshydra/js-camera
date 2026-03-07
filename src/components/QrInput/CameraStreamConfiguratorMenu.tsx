import { FormEvent, useEffect, useState } from 'react';
import { css } from '../../../styled-system/css';
import { VideoStreamConstrain } from './ConfigurationStorage';

interface CameraStreamConfiguratorMenuProps {
  className?: string;
  value: VideoStreamConstrain;
  onUpdateModelValue?: (value: VideoStreamConstrain) => void;
  onClose?: () => void;
}

type InputName = 'videoSource' | 'orientation';

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

const cssWrapper = css({
  backgroundColor: 'rgba(255,255,255,0.95)',
  boxShadow: '8px 8px 32px rgba(0,0,0,0.2)',
  borderRadius: '0.25rem',
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
  const selectedFacingMode = extractConfig(value as VideoStreamConstrain, 'facingMode');

  const handleInput = (
    inputName: InputName,
    event: FormEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    if (inputName === 'videoSource') {
      const selectEl = event.currentTarget;
      onUpdateModelValue?.({
        ...(value as object),
        deviceId: selectEl.value,
      } as VideoStreamConstrain);
    } else if (inputName === 'orientation') {
      const radioEl = event.currentTarget;
      onUpdateModelValue?.({
        ...(value as object),
        facingMode: radioEl.value,
      } as VideoStreamConstrain);
    }
  };

  return (
    <div className={`${cssWrapper} ${className || ''}`}>
      <button
        onClick={onClose}
        className={cssButton}
      >
        ❌
      </button>

      <form>
        <label>
          <h5>Video source</h5>
          <select
            className={cssInput}
            onChange={(e) => handleInput('videoSource', e)}
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
                {device.label}
              </option>
            ))}
          </select>
        </label>

        <h5>Facing</h5>
        <label>
          <input
            type="radio"
            name="orientation"
            checked={selectedFacingMode === 'user'}
            value="user"
            onChange={(e) => handleInput('orientation', e)}
          />
          Front
        </label>
        <label>
          <input
            type="radio"
            name="orientation"
            checked={selectedFacingMode === 'environment'}
            value="environment"
            onChange={(e) => handleInput('orientation', e)}
          />
          Back
        </label>
      </form>
    </div>
  );
}
