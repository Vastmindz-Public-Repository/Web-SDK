export interface RPPGCameraGetFrame {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export interface RPPGCameraInit {
  stream: MediaStream;
  width: number;
  height: number;
}

export interface RPPGCameraConfig {
  width: number;
  height: number;
  videoElement?: HTMLVideoElement | null;
  canvasElement?: HTMLCanvasElement | null;
  onError?: (event: Error) => void;
  onSuccess?: (event: RPPGCameraInit) => void;
}

export interface RPPGCameraInterface {
  config: RPPGCameraConfig;
  init: () => Promise<RPPGCameraInit>;
  close: () => void;
  getFrame: () => RPPGCameraGetFrame | null;
  onError: (event: Error) => void;
  onSuccess: (event: RPPGCameraInit) => void;
}
