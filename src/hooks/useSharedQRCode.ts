import { type QrReaderData } from '../lib/barcodeScanner';
import { AppError, ErrorCode } from '../lib/errors';
import { decodeImageQRCode } from '../lib/decodeImageQRCode';
import { useEffect, useState } from 'react';
import { useShareHandler } from './useShareHandler';

export function useSharedQRCode(): QrReaderData {
  const sharedFile = useShareHandler();
  const [data, setData] = useState<QrReaderData>({
    data: null,
    error: null,
    scannerType: 'native',
  });

  useEffect(() => {
    if (!sharedFile) {
      return;
    }

    decodeImageQRCode(sharedFile.file)
      .then((result) => {
        setData({
          data: result,
          error: null,
          scannerType: 'native',
        });
      })
      .catch((e) => {
        const error =
          e instanceof AppError
            ? e
            : new AppError(
                String(e),
                ErrorCode.BARCODE_DETECTION_FAILED,
                'Failed to decode QR code from shared image',
              );
        setData({
          data: null,
          error,
          scannerType: 'native',
        });
      });
  }, [sharedFile]);

  return data;
}
