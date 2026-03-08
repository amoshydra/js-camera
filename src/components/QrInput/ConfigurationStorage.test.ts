import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigurationStorage } from '../QrInput/ConfigurationStorage';

describe('ConfigurationStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('defaultConfig', () => {
    it('has environment facingMode', () => {
      expect(ConfigurationStorage.defaultConfig).toEqual(
        expect.objectContaining({
          facingMode: 'environment',
        }),
      );
    });

    it('has ideal width and height', () => {
      expect(ConfigurationStorage.defaultConfig).toEqual(
        expect.objectContaining({
          width: { ideal: 1024 },
          height: { ideal: 1024 },
        }),
      );
    });
  });

  describe('constructor', () => {
    it('loads default config when storage is empty', () => {
      const storage = new ConfigurationStorage();
      expect(storage.config).toEqual(ConfigurationStorage.defaultConfig);
    });

    it('loads stored config from localStorage', () => {
      const config = { facingMode: 'user' as const, width: 640 };
      localStorage.setItem('video_stream_constrain', JSON.stringify(config));

      const storage = new ConfigurationStorage();
      expect(storage.config).toEqual(config);
    });

    it('resets storage on invalid JSON', () => {
      localStorage.setItem('video_stream_constrain', 'invalid-json');

      const storage = new ConfigurationStorage();
      storage.load();
      expect(localStorage.getItem('video_stream_constrain')).toBeNull();
    });
  });

  describe('store', () => {
    it('stores data in localStorage', () => {
      const storage = new ConfigurationStorage();
      const config = { facingMode: 'user' as const };

      const result = storage.store(config);

      expect(result).toBe(true);
      expect(localStorage.getItem('video_stream_constrain')).toBe(JSON.stringify(config));
    });

    it('returns false when localStorage throws', () => {
      const storage = new ConfigurationStorage();
      storage.store({ facingMode: 'user' });

      localStorage.setItem.bind(localStorage);
      vi.stubGlobal('localStorage', {
        ...localStorage,
        setItem: () => {
          throw new Error('Quota exceeded');
        },
      });

      const result = storage.store({ facingMode: 'user' });
      expect(result).toBe(false);

      vi.unstubAllGlobals();
    });
  });

  describe('load', () => {
    it('returns stored config', () => {
      const config = { facingMode: 'user' as const };
      localStorage.setItem('video_stream_constrain', JSON.stringify(config));

      const storage = new ConfigurationStorage();
      expect(storage.load()).toEqual(config);
    });

    it('returns default when storage is empty', () => {
      const storage = new ConfigurationStorage();
      expect(storage.load()).toEqual(ConfigurationStorage.defaultConfig);
    });
  });

  describe('reset', () => {
    it('removes item from localStorage', () => {
      localStorage.setItem('video_stream_constrain', '{}');
      const storage = new ConfigurationStorage();

      storage.reset();

      expect(localStorage.getItem('video_stream_constrain')).toBeNull();
    });
  });
});
