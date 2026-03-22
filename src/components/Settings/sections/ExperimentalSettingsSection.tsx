import { useState } from 'react';
import { css } from '~styled-system/css';
import { settingsStore } from '../SettingsStore';

export default function ExperimentalSettingsSection() {
  const [enableAiMode, setEnableAiMode] = useState(() => settingsStore.settings.enableAiMode);

  const handleToggle = () => {
    const newValue = !settingsStore.settings.enableAiMode;
    setEnableAiMode(newValue);
    settingsStore.setEnableAiMode(newValue);
  };

  return (
    <section className={cssSection}>
      <h4 className={cssSectionTitle}>Experimental</h4>

      <div className={cssFieldGroup}>
        <div className={cssLabelGroup}>
          <span className={cssLabel}>AI Vision</span>
          <span className={cssDescription}>Enable AI-powered visual analysis mode</span>
        </div>
        <button
          type="button"
          className={cssToggle}
          onClick={handleToggle}
          aria-pressed={enableAiMode}
          aria-label={enableAiMode ? 'Disable AI Vision' : 'Enable AI Vision'}
        >
          <span className={enableAiMode ? cssToggleKnobOn : cssToggleKnobOff} />
        </button>
      </div>
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

const cssLabelGroup = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.125rem',
});

const cssLabel = css({
  fontSize: '0.875rem',
  color: 'rgba(255, 255, 255, 0.9)',
});

const cssDescription = css({
  fontSize: '0.7rem',
  color: 'rgba(255, 255, 255, 0.5)',
});

const cssToggle = css({
  position: 'relative',
  width: '44px',
  height: '24px',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '12px',
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  '&[aria-pressed="true"]': {
    backgroundColor: '#3b82f6',
  },
});

const cssToggleKnobOff = css({
  position: 'absolute',
  top: '2px',
  left: '2px',
  width: '20px',
  height: '20px',
  backgroundColor: 'white',
  borderRadius: '50%',
  transition: 'transform 0.2s ease',
});

const cssToggleKnobOn = css({
  position: 'absolute',
  top: '2px',
  right: '2px',
  width: '20px',
  height: '20px',
  backgroundColor: 'white',
  borderRadius: '50%',
  transition: 'transform 0.2s ease',
});
