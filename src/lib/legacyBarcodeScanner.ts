import { scanImageData, ZBarSymbolType } from '@undecaf/zbar-wasm';
import type { DetectedBarcode } from './barcodeScanner';

let zbarReady = false;

async function initZbar() {
  if (zbarReady) return;
  await scanImageData(new ImageData(1, 1));
  zbarReady = true;
}

function isVideoReady(video: HTMLVideoElement): boolean {
  return (
    video.readyState >= 2 &&
    video.videoWidth > 0 &&
    video.videoHeight > 0 &&
    !video.paused &&
    !video.ended
  );
}

export async function detectQRCodes(video: HTMLVideoElement): Promise<DetectedBarcode[]> {
  if (!isVideoReady(video)) {
    return [];
  }

  await initZbar();

  const canvas = document.createElement('canvas');
  const scale = Math.min(1, 600 / Math.max(video.videoWidth, video.videoHeight));
  canvas.width = video.videoWidth * scale;
  canvas.height = video.videoHeight * scale;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    return [];
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const results = await scanImageData(imageData);

  if (!results || results.length === 0) {
    return [];
  }

  return results
    .filter((result) => result.type === ZBarSymbolType.ZBAR_QRCODE)
    .map((result) => ({
      rawValue: result.decode(),
      format: 'qr_code',
      boundingBox: new DOMRectReadOnly(0, 0, canvas.width, canvas.height),
      cornerPoints: result.points.map((p) => ({ x: p.x, y: p.y })),
    }));
}
