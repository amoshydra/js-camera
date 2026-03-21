import { useState, useEffect } from 'react';
import { useIdle, getIdleTimeout } from './hooks/useIdle';
import { useSharedQRCode } from './hooks/useSharedQRCode';
import { settingsStore } from './components/Settings/SettingsStore';
import QrScanner from './pages/QrScanner';
import { type Mode } from './components/ModeToggle/ModeToggle';

export default function App() {
  const [mode, setMode] = useState<Mode>('qr');
  const [enableAiMode, setEnableAiMode] = useState(() => settingsStore.settings.enableAiMode);
  const isIdle = useIdle(getIdleTimeout(mode));
  const initialData = useSharedQRCode();

  useEffect(() => {
    const handleSettingsChange = () => {
      const newEnableAiMode = settingsStore.settings.enableAiMode;
      setEnableAiMode(newEnableAiMode);
      if (!newEnableAiMode && mode === 'ai') {
        setMode('qr');
      }
    };
    window.addEventListener('js-camera-settings-change', handleSettingsChange);
    return () => window.removeEventListener('js-camera-settings-change', handleSettingsChange);
  }, [mode]);

  const handleModeChange = (newMode: Mode) => {
    if (!enableAiMode && newMode === 'ai') {
      return;
    }
    setMode(newMode);
  };

  return (
    <QrScanner
      disabled={isIdle}
      initialData={initialData}
      mode={mode}
      onModeChange={handleModeChange}
      enableAiMode={enableAiMode}
    />
  );
}
