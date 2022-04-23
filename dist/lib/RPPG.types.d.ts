import { RPPGCameraConfig, RPPGCameraInit } from './RPPGCamera.types';
import { AccessToken, BloodPressure, HrvMetrics, InterferenceWarning, MeasurementMeanData, MeasurementProgress, MeasurementSignal, MeasurementStatus, MovingWarning, RPPGSocketConfig, SendingRateWarning, SignalQuality, StressIndex, UnstableConditionsWarning } from './RPPGSocket.types';
import { RPPGTrackerConfig, RPPGTrackerProcessLandmarkData } from './RPPGTracker.types';
/**
 * RPPGOnFrame
 *
 */
export interface RPPGOnFrame {
    /**
     * Returns data of RPPG tracker
     *
     * @type {RPPGTrackerProcessLandmarkData}
     * @memberof RPPGOnFrame
     */
    rppgTrackerData: RPPGTrackerProcessLandmarkData;
    /**
     * Instant value of FPS
     *
     * @type {number}
     * @memberof RPPGOnFrame
     */
    instantFps: number;
    /**
     * Average value of FPS
     *
     * @type {number}
     * @memberof RPPGOnFrame
     */
    averageFps: number;
    /**
     * Timestamp of last frame
     *
     * @type {number}
     * @memberof RPPGOnFrame
     */
    timestamp: number;
}
/**
 * RPPGConfig
 *
 * This is config for RPPG instance
 *
 * ### Usage with regular javascript
 *
 * ```javascript
 * const rppgInstance = new RPPG({
 *   onMeasurementMeanData: data => console.log('MeasurementMeanData:', data)
 * })
 * ```
 *
 */
export interface RPPGConfig {
    rppgTrackerConfig?: RPPGTrackerConfig;
    rppgSocketConfig?: RPPGSocketConfig;
    rppgCameraConfig?: RPPGCameraConfig;
    /**
     * onFrame event, cb: {@link RPPGOnFrame}
     *
     * ### Usage with regular javascript
     *
     * ```javascript
     * const rppgInstance = new RPPG({
     *   onFrame: ({@link RPPGOnFrame}) => console.log('onFrame:', {@link RPPGOnFrame})
     * })
     * ```
     */
    onFrame?: (data: RPPGOnFrame) => void;
    /**
     * onAccessToken event, cb: {@link AccessToken}
     *
     * ### Usage with regular javascript
     *
     * ```javascript
     * const rppgInstance = new RPPG({
     *   onAccessToken: ({@link AccessToken}) => console.log('onAccessToken:', {@link AccessToken})
     * })
     * ```
     */
    onAccessToken?: (arg0: AccessToken) => void;
    /**
     * onMeasurementMeanData event, cb: {@link MeasurementMeanData}
     *
     * ### Usage with regular javascript
     *
     * ```javascript
     * const rppgInstance = new RPPG({
     *   onMeasurementMeanData: ({@link MeasurementMeanData}) => console.log('onMeasurementMeanData:', {@link MeasurementMeanData})
     * })
     * ```
     */
    onMeasurementMeanData?: (arg0: MeasurementMeanData) => void;
    /**
     * onMeasurementStatus event, cb: {@link MeasurementStatus}
     *
     * ### Usage with regular javascript
     *
     * ```javascript
     * const rppgInstance = new RPPG({
     *   onMeasurementStatus: ({@link MeasurementStatus}) => console.log('onMeasurementStatus:', {@link MeasurementStatus})
     * })
     * ```
     */
    onMeasurementStatus?: (arg0: MeasurementStatus) => void;
    /**
     * onSendingRateWarning event, cb: {@link SendingRateWarning}
     *
     * ### Usage with regular javascript
     *
     * ```javascript
     * const rppgInstance = new RPPG({
     *   onSendingRateWarning: ({@link SendingRateWarning}) => console.log('onSendingRateWarning:', {@link SendingRateWarning})
     * })
     * ```
     */
    onSendingRateWarning?: (arg0: SendingRateWarning) => void;
    /**
     * onMeasurementProgress event, cb: {@link MeasurementProgress}
     *
     * ### Usage with regular javascript
     *
     * ```javascript
     * const rppgInstance = new RPPG({
     *   onMeasurementProgress: ({@link MeasurementProgress}) => console.log('onMeasurementProgress:', {@link MeasurementProgress})
     * })
     * ```
     */
    onMeasurementProgress?: (arg0: MeasurementProgress) => void;
    /**
     * onMeasurementSignal event, cb: {@link MeasurementSignal}
     *
     * ### Usage with regular javascript
     *
     * ```javascript
     * const rppgInstance = new RPPG({
     *   onMeasurementSignal: ({@link MeasurementSignal}) => console.log('onMeasurementSignal:', {@link MeasurementSignal})
     * })
     * ```
     */
    onMeasurementSignal?: (arg0: MeasurementSignal) => void;
    /**
     * onMovingWarning event, cb: {@link MovingWarning}
     *
     * ### Usage with regular javascript
     *
     * ```javascript
     * const rppgInstance = new RPPG({
     *   onMovingWarning: ({@link MovingWarning}) => console.log('onMovingWarning:', {@link MovingWarning})
     * })
     * ```
     */
    onMovingWarning?: (arg0: MovingWarning) => void;
    /**
     * onBloodPressure event, cb: {@link BloodPressure}
     *
     * ### Usage with regular javascript
     *
     * ```javascript
     * const rppgInstance = new RPPG({
     *   onBloodPressure: ({@link BloodPressure}) => console.log('onBloodPressure:', {@link BloodPressure})
     * })
     * ```
     */
    onBloodPressure?: (arg0: BloodPressure) => void;
    /**
     * onSignalQuality event, cb: {@link SignalQuality}
     *
     * ### Usage with regular javascript
     *
     * ```javascript
     * const rppgInstance = new RPPG({
     *   onSignalQuality: ({@link SignalQuality}) => console.log('onSignalQuality:', {@link SignalQuality})
     * })
     * ```
     */
    onSignalQuality?: (arg0: SignalQuality) => void;
    /**
     * onInterferenceWarning event, cb: {@link InterferenceWarning}
     *
     * ### Usage with regular javascript
     *
     * ```javascript
     * const rppgInstance = new RPPG({
     *   onInterferenceWarning: ({@link InterferenceWarning}) => console.log('onInterferenceWarning:', {@link InterferenceWarning})
     * })
     * ```
     */
    onInterferenceWarning?: (arg0: InterferenceWarning) => void;
    /**
    * onUnstableConditionsWarning event, cb: {@link UnstableConditionsWarning}
    *
    * ### Usage with regular javascript
    *
    * ```javascript
    * const rppgInstance = new RPPG({
    *   onUnstableConditionsWarning: ({@link UnstableConditionsWarning}) => console.log('onUnstableConditionsWarning:', {@link UnstableConditionsWarning})
    * })
    * ```
    */
    onUnstableConditionsWarning?: (arg0: UnstableConditionsWarning) => void;
    /**
    * onHrvMetrics event, cb: {@link HrvMetrics}
    *
    * ### Usage with regular javascript
    *
    * ```javascript
    * const rppgInstance = new RPPG({
    *   onHrvMetrics: ({@link HrvMetrics}) => console.log('onHrvMetrics:', {@link HrvMetrics})
    * })
    * ```
    */
    onHrvMetrics?: (arg0: HrvMetrics) => void;
    /**
    * onStressIndex event, cb: {@link StressIndex}
    *
    * ### Usage with regular javascript
    *
    * ```javascript
    * const rppgInstance = new RPPG({
    *   onStressIndex: ({@link StressIndex}) => console.log('onStressIndex:', {@link StressIndex})
    * })
    * ```
    */
    onStressIndex?: (arg0: StressIndex) => void;
}
export interface RPPGinterface {
    config: RPPGConfig;
    version?: string;
    start: () => void;
    stop: () => void;
    init: () => Promise<void>;
    initTracker(rppgTrackerConfig: RPPGTrackerConfig): Promise<void>;
    initSocket(rppgSocketConfig: RPPGSocketConfig): Promise<Event>;
    initCamera(rppgCameraConfig: RPPGCameraConfig): Promise<void>;
    closeCamera(): void;
    switchCamera: (useFrontCamera: boolean) => Promise<RPPGCameraInit | void>;
}
