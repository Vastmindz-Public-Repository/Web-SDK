
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
 *   width: 640,
 *   height: 480,
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
  getFrame: () => RPPGCameraGetFrame | null;
  onError: (event: Error) => void;
  onSuccess: (event: RPPGCameraInit) => void;
}
