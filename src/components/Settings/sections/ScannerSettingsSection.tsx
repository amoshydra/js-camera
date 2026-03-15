import { useState } from 'react';
import { css } from '~styled-system/css';
import { settingsStore, Settings } from '../SettingsStore';

export default function ScannerSettingsSection() {
  const [settings, setSettings] = useState<Settings>(() => settingsStore.load());

  const handleDebugChange = (checked: boolean) => {
    settingsStore.setDebug(checked);
    setSettings((s) => ({ ...s, debug: checked }));
  };

  const handleScannerChange = (value: 'browser' | 'legacy') => {
    settingsStore.setScanner(value);
    setSettings((s) => ({ ...s, scanner: value }));
  };

  return (
    <section className={cssSection}>
      <h4 className={cssSectionTitle}>Scanner</h4>

      <label className={cssFieldGroup}>
        <span className={cssLabel}>Type</span>
        <select
          className={cssInput}
          value={settings.scanner}
          onChange={(e) => handleScannerChange(e.target.value as 'browser' | 'legacy')}
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
            onChange={(e) => handleDebugChange(e.target.checked)}
            className={cssToggleInput}
          />
          <span className={cssToggleSlider} />
        </label>
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
