import { useEffect, useState } from 'react';
import { css } from '~styled-system/css';
import { VideoStreamConstrain } from '@/components/QrInput/ConfigurationStorage';
import { extractOrGetFirst } from '@/components/QrInput/CameraStreamConfigurator.lib';

interface CameraSettingsSectionProps {
  value: VideoStreamConstrain;
  onUpdateModelValue?: (value: VideoStreamConstrain) => void;
}

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

export default function CameraSettingsSection({
  value,
  onUpdateModelValue,
}: CameraSettingsSectionProps) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const selectedDeviceId = extractConfig(value as VideoStreamConstrain, 'deviceId');

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceList) => {
      setDevices(deviceList.filter(({ kind }) => kind === 'videoinput'));
    });
  }, []);

  const handleInput = (deviceId: string) => {
    onUpdateModelValue?.({
      ...(value as object),
      deviceId,
    } as VideoStreamConstrain);
  };

  return (
    <section className={cssSection}>
      <h4 className={cssSectionTitle}>Camera</h4>

      <label className={cssFieldGroup}>
        <span className={cssLabel}>Video source</span>
        <select
          className={cssInput}
          onChange={(e) => handleInput(e.target.value)}
        >
          <option
            key="default"
            value=""
            selected={!selectedDeviceId}
          >
            Default camera
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
    </section>
  );
}

const cssSection = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
});

const cssSectionTitle = css({
  fontSize: '0.75rem',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'rgba(255, 255, 255, 0.5)',
  margin: 0,
});

const cssFieldGroup = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
});

const cssLabel = css({
  fontSize: '0.875rem',
  color: 'rgba(255, 255, 255, 0.9)',
});

const cssInput = css({
  maxWidth: '100%',
  padding: '0.5rem 0.75rem',
  fontSize: '0.875rem',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '6px',
  color: 'white',
  cursor: 'pointer',
  '&:focus': {
    outline: 'none',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  '& option': {
    backgroundColor: '#1a1a1a',
    color: 'white',
  },
});
