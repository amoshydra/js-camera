export enum ErrorCode {
  BARCODE_DETECTOR_NOT_SUPPORTED = 'BARCODE_DETECTOR_NOT_SUPPORTED',
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
