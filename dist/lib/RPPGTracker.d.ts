import { RPPGTrackerConfig, RPPGTrackerInterface, RPPGTrackerProcessLandmarkData } from './RPPGTracker.types';
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
    processLandmarksImage(data: Uint8ClampedArray): Promise<RPPGTrackerProcessLandmarkData>;
    /**
     * getBgr1d
     * @returns {number[]}
     */
    getBgr1d(): number[];
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
