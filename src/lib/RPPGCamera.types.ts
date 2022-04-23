
/**
 * RPPGCameraGetFrame
 *
 * RPPG Camera getFrame response
 *
 * ### Usage with regular javascript
 *
 * ```javascript
 * const {
 *   width,
 *   height,
 *   data
 * } = await rppgInstance.getFrame()
 * ```
 *
 */
export interface RPPGCameraGetFrame {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

/**
 * RPPGCameraInit
 *
 * RPPG Camera init response
 *
 * ### Usage with regular javascript
 *
 * ```javascript
 * const rppgInstance = new RPPG()
 * const {
 *   width,
 *   height,
 *   stream
 * } = await rppgInstance.initCamera({
 *   ...
 * })
 * ```
 *
 */
export interface RPPGCameraInit {
  stream: MediaStream;
  width: number;
  height: number;
}

/**
 * RPPGCameraConfig
 *
 * Configuration for RPPG Camera instance
 *
 * ### Usage with regular javascript
 *
 * ```javascript
 * const rppgInstance = new RPPG()
 * await rppgInstance.initCamera({
 *   stream, // used for external Media stream, eg: WebRTC Media stream
 *   width: 640, // used when no stream passed, get stream from webcam
 *   height: 480, // used when no stream passed, get stream from webcam
 *   videoElement: document.querySelector('video'),
 *   canvasElement: document.querySelector('canvas'),
 *   onSuccess: data => console.log('Initializing camera success', data),
 *   onError: error => console.error('Error initializing camera', error)
 * })
 * ```
 *
 */
export interface RPPGCameraConfig {
  /**
  * width, Desired width of the camera.
  * Default: 640 (px)
  * @memberof RPPGCameraConfig
  */
  width?: number;
  
  /**
  * height: Desired height of the camera.
  * Default: 480 (px)
  * @memberof RPPGCameraConfig
  */
  height?: number;
  
  /**
  * DOM video element. If passed - video stream will be shown on this element,
  * if not passed - will be created a new one
  */
  videoElement?: HTMLVideoElement | null;

  /**
  * DOM canvas element
  * @memberof RPPGCameraConfig
  */
  canvasElement?: HTMLCanvasElement | null;

  /**
   * Media stream
   * @memberof RPPGCameraConfig
   */
  stream?: MediaStream | null;

  /**
   * Use front camera
   * @memberof RPPGCameraConfig
   */
  useFrontCamera: boolean
  
  /**
   * onError event
   * @memberof RPPGCameraConfig
   */
  onError?: (event: Error) => void;

  /**
   * onSuccess event
   * @memberof RPPGCameraConfig
   */
  onSuccess?: (event: RPPGCameraInit) => void;
}

export interface RPPGCameraInterface {
  config: RPPGCameraConfig;
  init: () => Promise<RPPGCameraInit>;
  close: () => void;
  switchCamera: (useFrontCamera: boolean) => Promise<RPPGCameraInit | void>;
  getFrame: () => RPPGCameraGetFrame | null;
  onError: (event: Error) => void;
  onSuccess: (event: RPPGCameraInit) => void;
}

export enum SourceWebcam {
  user = 'user',
  environment = 'environment',
}