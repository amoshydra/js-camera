interface CameraStreamReceiverSlotDataFailed {
  error: Error;
  stream: null;
}

interface CameraStreamReceiverSlotDataGeneric {
  error: null;
  stream: MediaStream | null;
}

export type CameraStreamReceiverSlotData = CameraStreamReceiverSlotDataGeneric | CameraStreamReceiverSlotDataFailed;
