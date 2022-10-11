import { MessageEvents } from "./RPPGEvents.types"

/**
 * RPPGTrackerConfig
 */
export interface RPPGTrackerConfig {
  /** */
  serverless?: boolean;

  /** */
  width?: number;

  /** */
  height?: number;

  /** */
  pathToWasmData?: string;

  /** */
  maxTimeBetweenBlinksSeconds?: number
  
  /** */
  detectionThreshold?: number

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

  /** */
  onEvent?: (
    arg0: string,
    arg1: MessageEvents) => void; // todo fix import
}

/**
 * RPPGTrackerProcessFrameData
 */
export interface RPPGTrackerProcessFrameData {
  /** */
  status: number;

  /** */
  bgr1d: number[];

  /** */
  landmarks: number[];

  /** */
  face: number[];

  /**
   * eyeBlinkStatus
   * It returns true if the eye blinks were detected during the last 20 sec, and it returns false otherwise.
   */
  eyeBlinkStatus: boolean

  /**
   * imageQualityFlags
   * It returns 4 flags in a list (brightColorFlag, illumChangeFlag, noiseFlag, sharpFlag)
  */
  imageQualityFlags: ImageQualityFlags
}

/**
 * ImageQualityFlags
 */
export interface ImageQualityFlags {
  /** */
  brightColorFlag: boolean
  
  /** */
  illumChangeFlag: boolean
  
  /** */
  noiseFlag: boolean
  
  /** */
  sharpFlag: boolean

  /** */
  faceSizeFlag: boolean

  /** */
  faceOrientFlag: boolean
}

export interface RPPGTrackerInterface {
  config: RPPGTrackerConfig;
  init: () => Promise<void>;
  reInit: () => void;
  processFrame: (data: Uint8ClampedArray, timestamp: number) => Promise<RPPGTrackerProcessFrameData>;
  getBgr1d: () => number[];
  getLastLandmarks: () => number[];
  getFace: () => number[];
}

export interface EmscriptenModule {
  _process_landmarks: (arg0: number, arg1: number, arg2: number, timestamp: number) => void;
  _track: (arg0: number, arg1: number, arg2: number, timestamp: number) => void;
  getStatus: () => number;
  getEyeBlinkStatus: (maxTimeBetweenBlinksSeconds: number, detectionThreshold: number) => boolean;
  getImageQualityFlags: () => number
  getBP: () => number
  getBPM: () => number
  get_bgr1d: () => any;
  getHRVFeatures: () => any;
  getMean_BPM_RR_SpO2: () => any;
  getSignal: (size: number) => any;
  getECG: (size: number) => any;
  getPeaksIndexes: (size: number) => any;
  getRR: () => any;
  getSNR: () => any;
  getMeanSNR: () => any;
  getSpO2: () => any;
  getStressStatus: () => any;
  getStress: () => any;
  getProgress: () => any;
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
