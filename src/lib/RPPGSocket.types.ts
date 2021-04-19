/**
 * RPPGSocketConfig
 */
export interface RPPGSocketConfig {
  /***/
  url?: string;

  /***/
  authToken: string;

  /***/
  onConnect?: (arg0: Event) => void;

  /***/
  onClose?: (arg0: CloseEvent) => void;

  /***/
  onError?: (arg0: Event) => void;

  /***/
  onMessage?: (
    arg0: string,
    arg1: MessageEvents) => void;

  onEvent?: (
    arg0: string,
    arg1: MessageEvents) => void;
}

/**
 * MessageEvents
 */
export type MessageEvents =
  AccessToken |
  MeasurementMeanData |
  MeasurementStatus |
  SendingRateWarning |
  MeasurementProgress |
  MeasurementSignal |
  MovingWarning |
  BloodPressure |
  SignalQuality |
  InterferenceWarning |
  UnstableConditionsWarning |
  HrvMetrics

/**
 * RPPGSocketSendMessage
 */
export interface RPPGSocketSendMessage {
  /***/
  bgrSignal: number[];

  /***/
  timestamp: number;
}

export interface RPPGSocketInterface {
  config: RPPGSocketConfig;
  init: () => Promise<Event>;
  send: (message: RPPGSocketSendMessage) => void;
}

/**
 * RPPGSocketOnMessageType
 */
export enum RPPGSocketOnMessageType {
  MEASUREMENT_MEAN_DATA,
  MEASUREMENT_STATUS,
  SENDING_RATE_WARNING,
  MEASUREMENT_PROGRESS,
  MEASUREMENT_SIGNAL,
  MOVING_WARNING,
  BLOOD_PRESSURE,
  SIGNAL_QUALITY,
  INTERFERENCE_WARNING,
  UNSTABLE_CONDITIONS_WARNING,
}

/**
 * Access token for retrieval of final measurement results via HTTP endpoint
 * 
 * 
 * This message contains access token which should be used to retrieve final measurement results after the websocket is closed. This message is sent by backend only once just after websocket is opened. Frontend should save this access token and use it later to get final measurement results via HTTP endpoint.
 * @example
 * {
 *   "messageType": "ACCESS_TOKEN",
 *   "data": {
 *       "accessToken": "f3d19dff-6119-4b50-94e0-5667efaeb1f7"
 *   }
 *}
 */
export interface AccessToken {
  /** Value of access token */
  accessToken: string;
}

/**
 * Measurement mean data for current session
 *
 * This message contains mean measurement data for the current session.
 * @example
 * {
 *   "messageType": "MEASUREMENT_MEAN_DATA",
 *   "data": {
 *       "bpm": 74,
 *       "rr": 154,
 *       "oxygen": 99,
 *       "stressStatus": "NORMAL",
 *       "bloodPressureStatus": "NORMAL"
 *   }
 * }
 */
export interface MeasurementMeanData {
  /** Mean value of heartbeat BPM; if 0, the value can't be calculated */
  bpm: number;

  /** Mean value of respiration rate; if 0, the value can't be calculated */
  rr: number;

  /** Mean value of oxygen; if 0, the value can't be calculated */
  oxygen: number;

  /** Mean value of stress status */
  stressStatus: StressStatus;

  /** Mean value of blood pressure status */
  bloodPressureStatus: BloodPressureStatus;
}

/**
 * StressStatus
 */
export enum StressStatus {
  NO_DATA,
  LOW,
  NORMAL,
  ELEVATED,
  VERY_HIGH,
  UNKNOWN
}

/**
 * BloodPressureStatus
 */
export enum BloodPressureStatus {
  NO_DATA,
  NORMAL,
  ELEVATED,
  HYP_S1,
  HYP_S2,
  HYP_CRISIS,
  UNKNOWN
}

/**
 * Current status of measurement engine
 * 
 * This message contains current status of measurement engine.
 * @example
 * {
 *   "messageType": "MEASUREMENT_STATUS",
 *   "data": {
 *       "statusCode": "SUCCESS",
 *       "statusMessage": "Success"
 *   }
 * }
 */
export interface MeasurementStatus {
  /** Code of current status */
  statusCode: StatusCode;

  /** Description of current status (for debugging purposes only) */
  statusMessage: string;
}

/**
 * StatusCode
 */
export enum StatusCode {
  SUCCESS,
  NO_FACE,
  FACE_LOST,
  CALIBRATING,
  RECALIBRATING,
  BRIGHT_LIGHT_ISSUE,
  NOISE_DURING_EXECUTION,
  UNKNOWN
}

/**
 * SendingRateWarning
 */
export interface SendingRateWarning {
  /***/
  delayValue: string;

  /***/
  notificationMessage: string;
}

/**
 * Current progress of the measurement
 * 
 * This message contains current progress of the measurement. The progress here means amount of images supplied to the backend divided by minimum amount of images required by RPPG algorithm to start calculating BPM values. For example, if progress = 75%, it means that only 75% of required images were supplied, so RPPG algorithm can't start calculating values yet. If progress = 100%, it means that there were enough images supplied, so RPPG algorithm can already calculate the values. If progress > 100%, it means that RPPG algorithm is in the recalibrating process.
 * @example
 * {
 *   "messageType": "MEASUREMENT_PROGRESS",
 *   "data": {
 *       "progressPercent": 55,
 *   }
 * }
 */
export interface MeasurementProgress {
  /** Current progress (in percent) */
  progressPercent: number;
}

/**
 * MeasurementSignal
 */
export interface MeasurementSignal {
  /***/
  signal: number[];
}

/**
 * MovingWarning
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MovingWarning { }

/**
 * BloodPressure
 */
export interface BloodPressure {
  /***/
  systolic: number;

  /***/
  diastolic: number;
}

/**
 * SignalQuality
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SignalQuality {
  /***/
  snr: number;
}

/**
 * InterferenceWarning
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InterferenceWarning {

}

/**
 * UnstableConditionsWarning
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UnstableConditionsWarning {

}

/**
 * HrvMetrics
 */
export interface HrvMetrics {
  /***/
  ibi: number;

  /***/
  rmssd: number

  /***/
  sdnn: number
}
