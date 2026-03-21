export interface CapturedFrame {
  dataUrl: string;
  width: number;
  height: number;
  timestamp: number;
}

export function captureFrame(
  video: HTMLVideoElement,
  options: {
    maxWidth?: number;
    quality?: number;
  } = {},
): CapturedFrame | null {
  const { maxWidth = 1920, quality = 0.8 } = options;

  if (video.videoWidth === 0 || video.videoHeight === 0) {
    return null;
  }

  const scale = Math.min(1, maxWidth / video.videoWidth);
  const width = Math.round(video.videoWidth * scale);
  const height = Math.round(video.videoHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }

  ctx.drawImage(video, 0, 0, width, height);

  const dataUrl = canvas.toDataURL('image/jpeg', quality);

  return {
    dataUrl,
    width,
    height,
    timestamp: Date.now(),
  };
}

export function dataUrlToBase64(dataUrl: string): string {
  const base64Index = dataUrl.indexOf('base64,');
  if (base64Index === -1) {
    return dataUrl;
  }
  return dataUrl.slice(base64Index + 7);
}
