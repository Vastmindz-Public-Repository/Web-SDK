import { HrvMetrics, BloodPressureStatus, StressStatus } from './RPPGEvents.types';
import { ImageQualityFlags, RPPGTrackerConfig, RPPGTrackerInterface, RPPGTrackerProcessFrameData } from './RPPGTracker.types';
/**
 * Class RPPGTracker
 * @example
 * const rppgTrackerInstance = new RPPGTracker()
 */
declare class RPPGTracker implements RPPGTrackerInterface {
    config: RPPGTrackerConfig;
    private Module;
    private module;
    private deepColor;
    private inputBuf;
    private uint8Array;
    private bufferSize;
    private width;
    private height;
    private unstableTimeout;
    private unstableTimeoutLimit;
    /**
     * @param {RPPGTrackerConfig} config Config passed to RPPGTracker
     */
    constructor(config?: RPPGTrackerConfig);
    /**
     * Init RPPG Tracker instance
     * @returns {Promise<void>}
     */
    init(): Promise<void>;
    private getModuleOptions;
    private initMemoryBuffer;
    processFrame(data: Uint8ClampedArray): Promise<RPPGTrackerProcessFrameData>;
    /**
     * getBgr1d
     * @returns {number[]}
     */
    getBgr1d(): number[];
    /**
     * getImageQualityFlags
     * @returns {ImageQualityFlags}
     */
    getImageQualityFlags(): ImageQualityFlags;
    /**
     * getEyeBlinkStatus
     * @returns {boolean}
     */
    getEyeBlinkStatus(): boolean;
    /**
     * getHRVFeatures
     * @returns {number[]}
     */
    getHRVFeatures(): HrvMetrics;
    /**
     * getMean_BPM_RR_SpO2
     * @returns {number[]}
     */
    getMean_BPM_RR_SpO2(): {
        bpm_mean: number;
        rr_mean: number;
        oxygen_mean: number;
    };
    /**
     * getSignal
     * @returns {number[]}
     */
    getSignal(size?: number, zoom?: number): number[];
    /**
     * getECG
     * @returns {number[]}
     */
    getECG(size?: number, zoom?: number): number[];
    /**
     * getPeaksIndexes
     * @returns {number[]}
     */
    getPeaksIndexes(size?: number): number[];
    /**
     * getBPStatus
     * @returns {string}
     */
    getBPStatus(): BloodPressureStatus;
    /**
     * getBP
     * @returns {number}
     */
    getBP(): number;
    /**
     * getBPM
     * @returns {number}
     */
    getBPM(): number;
    /**
     * getSNR
     * @returns {number}
     */
    getSNR(): number;
    /**
     * getMeanSNR
     * @returns {number}
     */
    getMeanSNR(): number;
    /**
     * getStatus
     * @returns {number}
     */
    getStatus(): number;
    /**
     * getRR
     * @returns {number}
     */
    getRR(): number;
    /**
     * getSPO
     * @returns {number}
     */
    getSPO(): number;
    /**
     * getStressStatus
     * @returns {number}
     */
    getStressStatus(): StressStatus;
    /**
     * getStress
     * @returns {numbe}
     */
    getStress(): number;
    /**
     * getProgress
     * @returns {number}
     */
    getProgress(): number;
    /**
     * getLastLandmarks
     * @returns {number[]}
     */
    getLastLandmarks(): number[];
    /**
     * getFace
     * @returns {number[]}
     */
    getFace(): number[];
    /**
     * getROIs
     * @returns {void[]}
     */
    getROIs(): void;
}
export default RPPGTracker;
