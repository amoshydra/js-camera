export interface Settings {
  debug: boolean;
  scanner: 'browser' | 'legacy';
  enableAiMode: boolean;
}

const SETTINGS_STORAGE_KEY = 'js-camera-settings';

export class SettingsStore {
  settings: Settings;

  constructor() {
    this.settings = this.load();
  }

  load(): Settings {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          ...this.getDefaultSettings(),
          ...parsed,
        };
      } catch {
        return this.getDefaultSettings();
      }
    }
    return this.getDefaultSettings();
  }

  getDefaultSettings(): Settings {
    const params = new URLSearchParams(window.location.search);
    return {
      debug: params.get('debug') === 'true',
      scanner: params.get('scanner') === 'legacy' ? 'legacy' : 'browser',
      enableAiMode: params.get('ai') === 'true',
    };
  }

  store(settings: Settings): void {
    this.settings = settings;
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }

  updateUrl(settings: Settings): void {
    const url = new URL(window.location.href);
    if (settings.debug) {
      url.searchParams.set('debug', 'true');
    } else {
      url.searchParams.delete('debug');
    }
    if (settings.scanner === 'legacy') {
      url.searchParams.set('scanner', 'legacy');
    } else {
      url.searchParams.delete('scanner');
    }
    if (settings.enableAiMode) {
      url.searchParams.set('ai', 'true');
    } else {
      url.searchParams.delete('ai');
    }
    window.history.pushState({}, '', url.toString());
    window.dispatchEvent(new Event('js-camera-settings-change'));
  }

  setDebug(value: boolean): void {
    const newSettings = { ...this.settings, debug: value };
    this.store(newSettings);
    this.updateUrl(newSettings);
  }

  setScanner(value: 'browser' | 'legacy'): void {
    const newSettings = { ...this.settings, scanner: value };
    this.store(newSettings);
    this.updateUrl(newSettings);
  }

  setEnableAiMode(value: boolean): void {
    const newSettings = { ...this.settings, enableAiMode: value };
    this.store(newSettings);
    this.updateUrl(newSettings);
  }
}

export const settingsStore = new SettingsStore();
