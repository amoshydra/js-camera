export enum ErrorCode {
  BARCODE_DETECTOR_NOT_SUPPORTED = 'BARCODE_DETECTOR_NOT_SUPPORTED',
  BARCODE_DETECTION_FAILED = 'BARCODE_DETECTION_FAILED',
}

export class AppError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public recommendation?: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
