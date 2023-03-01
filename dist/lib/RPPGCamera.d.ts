import { RPPGCameraConfig, RPPGCameraGetFrame, RPPGCameraInit, RPPGCameraInterface } from './RPPGCamera.types';
/**
 * Class RPPGCamera
 * @example
 * const rppgCameraInstance = new RPPGCamera()
 */
declare class RPPGCamera implements RPPGCameraInterface {
    config: RPPGCameraConfig;
    private videoElement;
    private canvasElement;
    private ctx;
    private stream;
    useFrontCamera: boolean;
    width: number;
    height: number;
    /**
     * @param {RPPGCameraConfig} config Config passed to RPPGCamera
     */
    constructor(config: RPPGCameraConfig);
    /**
     * Init RPPG Camera instance
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
     *   width: 640,
     *   height: 480,
     *   videoElement: document.querySelector('video'),
     *   canvasElement: document.querySelector('canvas'),
     *   onSuccess: data => console.log('Initializing camera success', data),
     *   onError: error => console.error('Error initializing camera', error)
     * })
     * ```
     *
     * @returns {Promise<RPPGCameraInit>} Returns actual parameters of camera
     *
     */
    init(): Promise<RPPGCameraInit>;
    /**
   * Switch Web Camera
   *
   * ### Usage with regular javascript
   *
   * ```javascript
   * switchWebcam(true)
   * ```
   *
   * @returns {Promise<RPPGCameraInit>} Returns actual parameters of camera
   *
   */
    switchCamera(useFrontCamera: boolean): Promise<RPPGCameraInit | void>;
    private getWebcamStream;
    getFrame(): RPPGCameraGetFrame | null;
    close(): void;
    onError(event: Error): void;
    onSuccess(event: RPPGCameraInit): void;
}
export default RPPGCamera;
