export const isScreenCaptureSupported = (): boolean => {
  return 'getDisplayMedia' in navigator.mediaDevices;
};

export const getScreenStream = (): Promise<MediaStream> => {
  return navigator.mediaDevices.getDisplayMedia({ video: true });
};
