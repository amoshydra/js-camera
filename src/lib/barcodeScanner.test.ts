import { afterEach, describe, expect, it, vi } from 'vitest';

describe('barcodeScanner', () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
    delete (window as any).BarcodeDetector;
  });

  describe('isBarcodeDetectorSupported', async () => {
    const { isBarcodeDetectorSupported } = await import('../lib/barcodeScanner');

    it('returns true when BarcodeDetector is in window', () => {
      (window as any).BarcodeDetector = vi.fn();

      expect(isBarcodeDetectorSupported()).toBe(true);
    });

    it('returns false when BarcodeDetector is not in window', () => {
      expect(isBarcodeDetectorSupported()).toBe(false);
    });
  });
});
