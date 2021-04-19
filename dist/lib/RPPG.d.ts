import { RPPGConfig, RPPGinterface, RPPGOnFrame } from './RPPG.types';
import { RPPGCameraConfig } from './RPPGCamera.types';
import { RPPGSocketConfig } from './RPPGSocket.types';
import { RPPGTrackerConfig } from './RPPGTracker.types';
/**
 * Class RPPG
 * @example
 * const rppgInstance = window.rppgInstance = new rppg({
 *   onFrame: (data) => console.log('onFrame', data),
 *   onMeasurementProgress: (data) => console.log('onMeasurementProgress', data),
 *   onMeasurementMeanData: (data) => console.log('onMeasurementMeanData', data),
 * })
 * await rppgInstance.initCamera({
 *   width: 640,
 *   height: 480,
 *   videoElement: videoElement,
 *   canvasElement: canvasElement,
 * })
 * await rppgInstance.initTracker({
 *   pathToWasmData: 'https://websdk1.blob.core.windows.net/sdk/',
 * })
 * await this.rppgInstance.initSocket({
 *   url: 'wss://rppg-dev2.xyz/vp/bgr_signal_socket',
 *   authToken: 'token',
 *   onConnect: () => console.log('Socket connection established'),
 *   onClose: (event) => console.log('Socket connection closed', event),
 *   onError: (event) => console.log('Socket connection error', event),
 * })
 * this.rppgInstance.start()
 */
declare class RPPG implements RPPGinterface {
    /**
     * config
     */
    config: RPPGConfig;
    /**
     * true, when tracking is active
     */
    processing: boolean;
    /**
     * RPPG version
     */
    version: string;
    private rppgCamera;
    private rppgTracker;
    private rppgSocket;
    private width;
    private height;
    private frameNumber;
    private averageFps;
    private timestamp;
    private startTimeStamp;
    private instantFps;
    /**
     * @param {RPPGConfig} config Config passed to RPPG
     */
    constructor(config?: RPPGConfig);
    init(): Promise<void>;
    /**
     * Initialize RPPG Tracker instance
     * @param {RPPGTrackerConfig} rppgTrackerConfig
     * @return {Promise<void>}
     * @example
     * const rppgInstance = new RPPG()
     * await rppgInstance.initTracker({
     *   pathToWasmData: 'https://websdk1.blob.core.windows.net/sdk/',
     * })
     */
    initTracker(rppgTrackerConfig?: RPPGTrackerConfig): Promise<void>;
    /**
     * Initialize RPPG Socket instance
     * @param {RPPGSocketConfig} rppgSocketConfig Socket configuration
     * @return {Promise<Event>}
     * @example
     * const rppgInstance = new RPPG()
     *   await this.rppgInstance.initSocket({
     *     url: 'wss://rppg-dev2.xyz/vp/bgr_signal_socket',
     *     authToken: 'token',
     *     onConnect: () => console.log('Socket connection established'),
     *     onClose: (event) => console.log('Socket connection closed', event),
     *     onError: (event) => console.log('Socket connection error', event),
     *   })
     *
     */
    initSocket(rppgSocketConfig: RPPGSocketConfig): Promise<Event>;
    /**
     * Initialize RPPG Camera instance
     * @param {RPPGCameraConfig} rppgCameraConfig
     * @return {Promise<void>}
     * @example
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
     *
     */
    initCamera(rppgCameraConfig: RPPGCameraConfig): Promise<void>;
    /**
     * Close camera stream
     * @return {void}
     */
    closeCamera(): void;
    /**
     * Start tracking
     * @return {void}
     */
    start(): void;
    /**
     * Stop tracking
     * @return {void}
     */
    stop(): void;
    private capture;
    /**
     * Describe your function
     * @param {RPPGOnFrame} data
     * @return {void}
     * @example
     * const rppgInstance = new rppg({
     *   onFrame: (data) => console.log('onFrame', data),
     * })
     */
    onFrame(data: RPPGOnFrame): void;
    private onEvent;
}
export default RPPG;
