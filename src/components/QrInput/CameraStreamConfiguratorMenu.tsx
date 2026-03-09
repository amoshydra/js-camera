import { ChangeEvent, useEffect, useState } from 'react';
import { css } from '~styled-system/css';
import { VideoStreamConstrain } from './ConfigurationStorage';
import { CloseIcon } from './Icons';
import { settingsStore, Settings } from './CameraStreamConfigurator.lib';

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
  const [settings, setSettings] = useState<Settings>(() => settingsStore.load());

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

  const handleDebugChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    settingsStore.setDebug(newValue);
    setSettings((s) => ({ ...s, debug: newValue }));
  };

  const handleScannerChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value as 'browser' | 'legacy';
    settingsStore.setScanner(newValue);
    setSettings((s) => ({ ...s, scanner: newValue }));
  };

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
        <section className={cssSection}>
          <h4 className={cssSectionTitle}>Scanner Settings</h4>

          <label className={cssFieldGroup}>
            <span className={cssLabel}>Scanner</span>
            <select
              className={cssInput}
              value={settings.scanner}
              onChange={handleScannerChange}
            >
              <option value="browser">Browser (native)</option>
              <option value="legacy">Legacy (zbar)</option>
            </select>
          </label>

          <label className={cssFieldGroup}>
            <span className={cssLabel}>Debug mode</span>
            <label className={cssToggle}>
              <input
                type="checkbox"
                checked={settings.debug}
                onChange={handleDebugChange}
                className={cssToggleInput}
              />
              <span className={cssToggleSlider} />
            </label>
          </label>
        </section>

        <div className={cssDivider} />

        <section className={cssSection}>
          <h4 className={cssSectionTitle}>Camera</h4>

          <label className={cssFieldGroup}>
            <span className={cssLabel}>Video source</span>
            <select
              className={cssInput}
              onChange={handleInput}
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

        <div className={cssFooter}>
          <a
            href="https://github.com/amoshydra/js-camera"
            target="_blank"
            rel="noopener noreferrer"
            className={cssLink}
          >
            GitHub - amoshydra/js-camera
          </a>
          <span className={cssVersion}>{import.meta.env.VITE_GIT_SHA}</span>
        </div>
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

const cssDivider = css({
  height: '1px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
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

const cssToggle = css({
  position: 'relative',
  display: 'inline-block',
  width: '44px',
  height: '24px',
  cursor: 'pointer',
});

const cssToggleInput = css({
  opacity: 0,
  width: 0,
  height: 0,
  '&:checked + span': {
    backgroundColor: '#3b82f6',
  },
  '&:checked + span::before': {
    transform: 'translateX(20px)',
  },
});

const cssToggleSlider = css({
  position: 'absolute',
  cursor: 'pointer',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '24px',
  transition: '0.2s',
  '&::before': {
    content: '""',
    position: 'absolute',
    height: '18px',
    width: '18px',
    left: '3px',
    bottom: '3px',
    backgroundColor: 'white',
    borderRadius: '50%',
    transition: '0.2s',
  },
});

const cssFooter = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 2,
  marginTop: 24,
});

const cssLink = css({
  color: 'blue.600',
  textDecoration: 'none',
  fontSize: '0.75rem',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const cssVersion = css({
  fontSize: '0.75rem',
  color: 'rgba(255,255,255,0.5)',
  fontFamily: 'mono',
});
