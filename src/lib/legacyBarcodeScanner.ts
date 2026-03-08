import type { DetectedBarcode } from './barcodeScanner';

let jsqrModule: typeof import('jsqr') | null = null;

async function loadJsQR() {
  if (!jsqrModule) {
    jsqrModule = await import('jsqr');
  }
  return jsqrModule;
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

  const jsqr = await loadJsQR();

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return [];
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const result = jsqr.default(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'dontInvert',
  });

  if (!result) {
    return [];
  }

  return [
    {
      rawValue: result.data,
      format: 'qr_code',
      boundingBox: new DOMRectReadOnly(
        result.location.topLeftCorner.x,
        result.location.topLeftCorner.y,
        result.location.bottomRightCorner.x - result.location.topLeftCorner.x,
        result.location.bottomRightCorner.y - result.location.topLeftCorner.y,
      ),
      cornerPoints: [
        result.location.topLeftCorner,
        result.location.topRightCorner,
        result.location.bottomRightCorner,
        result.location.bottomLeftCorner,
      ],
    },
  ];
}
