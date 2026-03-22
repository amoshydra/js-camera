import { useSyncExternalStore } from 'react';
import { settingsStore, Settings } from '@/components/Settings/SettingsStore';

function subscribe(callback: () => void) {
  window.addEventListener('js-camera-settings-change', callback);
  return () => window.removeEventListener('js-camera-settings-change', callback);
}

export function useSettings(): Settings {
  return useSyncExternalStore(
    subscribe,
    () => settingsStore.settings,
    () => settingsStore.settings,
  );
}
