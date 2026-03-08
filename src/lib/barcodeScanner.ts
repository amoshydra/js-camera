import { AppError, ErrorCode } from './errors';

export interface DetectedBarcode {
  rawValue: string;
  format: string;
  boundingBox: DOMRectReadOnly;
  cornerPoints: { x: number; y: number }[];
}

export interface QrReaderData {
  data: DetectedBarcode | null;
  error: AppError | null;
  scannerType: 'native' | 'legacy';
}

declare global {
  interface Window {
    BarcodeDetector?: {
      new (options?: { formats: string[] }): {
        detect: (source: ImageBitmapSource) => Promise<DetectedBarcode[]>;
      };
      getSupportedFormats(): Promise<string[]>;
    };
  }
}

const SUPPORTED_FORMATS = [
  'aztec',
  'code_128',
  'code_39',
  'code_93',
  'codabar',
  'data_matrix',
  'ean_13',
  'ean_8',
  'itf',
  'pdf417',
  'qr_code',
  'upc_a',
  'upc_e',
];

export function isBarcodeDetectorSupported(): boolean {
  return 'BarcodeDetector' in window;
}

let barcodeDetectorInstance: InstanceType<NonNullable<Window['BarcodeDetector']>> | null = null;

export async function getBarcodeDetector() {
  if (barcodeDetectorInstance) {
    return barcodeDetectorInstance;
  }

  if (!isBarcodeDetectorSupported()) {
    throw new AppError(
      'BarcodeDetector is not supported in this browser',
      ErrorCode.BARCODE_DETECTOR_NOT_SUPPORTED,
      'Please use Chrome 83+ or Edge 83+ on desktop, or Android (Chrome) to scan QR codes',
    );
  }

  barcodeDetectorInstance = new window.BarcodeDetector!({
    formats: SUPPORTED_FORMATS,
  });

  return barcodeDetectorInstance;
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

  const detector = await getBarcodeDetector();
  const barcodes = await detector.detect(video);
  return barcodes.filter((barcode) => barcode.format === 'qr_code');
}

export async function detectBarcodes(video: HTMLVideoElement): Promise<DetectedBarcode[]> {
  if (!isVideoReady(video)) {
    return [];
  }

  const detector = await getBarcodeDetector();
  return detector.detect(video);
}

export async function getSupportedFormats(): Promise<string[]> {
  if (!isBarcodeDetectorSupported()) {
    return [];
  }
  return window.BarcodeDetector.getSupportedFormats();
}
