export enum ErrorCode {
  BARCODE_DETECTOR_NOT_SUPPORTED = 'BARCODE_DETECTOR_NOT_SUPPORTED',
  BARCODE_DETECTION_FAILED = 'BARCODE_DETECTION_FAILED',
  AI_NOT_CONFIGURED = 'AI_NOT_CONFIGURED',
  AI_FRAME_CAPTURE_FAILED = 'AI_FRAME_CAPTURE_FAILED',
  AI_API_ERROR = 'AI_API_ERROR',
  SCREEN_CAPTURE_NOT_SUPPORTED = 'SCREEN_CAPTURE_NOT_SUPPORTED',
  SCREEN_CAPTURE_STOPPED = 'SCREEN_CAPTURE_STOPPED',
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
