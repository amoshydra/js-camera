import { AppError, ErrorCode } from './errors';
import {
  isBarcodeDetectorSupported,
  getBarcodeDetector,
  type DetectedBarcode,
} from './barcodeScanner';
import { scanImageData, ZBarSymbolType } from '@undecaf/zbar-wasm';

export async function decodeImageQRCode(file: File): Promise<DetectedBarcode> {
  const imageBitmap = await createImageBitmap(file);

  let barcodes: DetectedBarcode[] = [];

  if (isBarcodeDetectorSupported()) {
    try {
      const detector = await getBarcodeDetector();
      barcodes = (await detector.detect(imageBitmap)).filter((b) => b.format === 'qr_code');
    } catch {
      // Fall through to legacy
    }
  }

  if (barcodes.length === 0) {
    barcodes = await decodeWithLegacy(imageBitmap);
  }

  if (barcodes.length === 0) {
    throw new AppError(
      'No QR code found in image',
      ErrorCode.BARCODE_DETECTION_FAILED,
      'Please upload an image containing a QR code',
    );
  }

  return barcodes[0];
}

async function decodeWithLegacy(imageBitmap: ImageBitmap): Promise<DetectedBarcode[]> {
  const canvas = document.createElement('canvas');
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    return [];
  }

  ctx.drawImage(imageBitmap, 0, 0);
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
