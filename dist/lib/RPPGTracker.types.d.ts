/**
 * RPPGTrackerConfig
 */
export interface RPPGTrackerConfig {
    /** */
    width?: number;
    /** */
    height?: number;
    /** */
    pathToWasmData?: string;
    /** */
    onError?: () => void;
    /** */
    onBgr1d?: () => void;
    /** */
    onLandmarks?: () => void;
    /** */
    onStatus?: () => void;
    /** */
    onFace?: () => void;
}
/**
 * RPPGTrackerProcessLandmarkData
 */
export interface RPPGTrackerProcessLandmarkData {
    /** */
    status: number;
    /** */
    bgr1d: number[];
    /** */
    landmarks: number[];
    /** */
    face: number[];
}
export interface RPPGTrackerInterface {
    config: RPPGTrackerConfig;
    init: () => Promise<void>;
    processLandmarksImage: (data: Uint8ClampedArray) => Promise<RPPGTrackerProcessLandmarkData>;
    getBgr1d: () => number[];
    getLastLandmarks: () => number[];
    getFace: () => number[];
}
export interface EmscriptenModule {
    _process_landmarks: (arg0: number, arg1: number, arg2: number) => void;
    getStatus: () => number;
    get_bgr1d: () => any;
    getFace: () => number[];
    getLastLandmarks: () => any;
    ready: Promise<void>;
    _initTracker: () => Promise<void>;
    _malloc: (arg0: number) => number;
    HEAP8: Int8Array;
    HEAP16: Int16Array;
    HEAP32: Int32Array;
    HEAPU8: Uint8Array;
    HEAPU16: Uint16Array;
    HEAPU32: Uint32Array;
    HEAPF32: Float32Array;
    HEAPF64: Float64Array;
}
