export interface RPPGSocketConfig {
  url?: string;
  authToken: string;
  onConnect?: (arg0: Event) => void;
  onClose?: (arg0: CloseEvent) => void;
  onError?: (arg0: Event) => void;
  onMessage?: (
    arg0: string,
    arg1: MessageEvents) => void;

  onEvent?: (
    arg0: string,
    arg1: MessageEvents) => void;
}

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

export interface RPPGSocketSendMessage {
  bgrSignal: number[];
  timestamp: number;
}

export interface RPPGSocketInterface {
  config: RPPGSocketConfig;
  init: () => Promise<Event>;
  send: (message: RPPGSocketSendMessage) => void;
}

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

export interface AccessToken {
  accessToken: string;
}

export interface MeasurementMeanData {
  bpm: number;
  rr: number;
  oxygen: number;
  stressStatus: StressStatus;
  bloodPressureStatus: BloodPressureStatus;
}

export enum StressStatus {
  NO_DATA,
  LOW,
  NORMAL,
  ELEVATED,
  VERY_HIGH,
  UNKNOWN
}

export enum BloodPressureStatus {
  NO_DATA,
  NORMAL,
  ELEVATED,
  HYP_S1,
  HYP_S2,
  HYP_CRISIS,
  UNKNOWN
}

export interface MeasurementStatus {
  statusCode: StatusCode;
  statusMessage: string;
}

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

export interface SendingRateWarning {
  delayValue: string;
  notificationMessage: string;
}

export interface MeasurementProgress {
  progressPercent: number;
}

export interface MeasurementSignal {
  signal: number[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MovingWarning { }

export interface BloodPressure {
  systolic: number;
  diastolic: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SignalQuality {
  snr: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InterferenceWarning {

}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UnstableConditionsWarning {

}

export interface HrvMetrics {
  ibi: number;
  rmssd: number
  sdnn: number
}
