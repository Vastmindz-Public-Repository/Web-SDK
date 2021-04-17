export interface RPPGSocketConfig {
  url: string;
  authToken: string;
  onConnect?: (arg0: Event) => void;
  onClose?: (arg0: CloseEvent) => void;
  onError?: (arg0: Event) => void;
  onMessage?: (
    arg0: string,
    arg1:
      MeasurementMeanData |
      MeasurementStatus |
      SendingRateWarning |
      MeasurementProgress |
      MeasurementSignal |
      MovingWarning |
      BloodPressure |
      SignalQuality |
      InterferenceWarning |
      UnstableConditionsWarning) => void;

  onMeasurementMeanData?: (arg0: MeasurementMeanData) => void;
  onMeasurementStatus?: (arg0: MeasurementStatus) => void;
  onSendingRateWarning?: (arg0: SendingRateWarning) => void;
  onMeasurementProgress?: (arg0: MeasurementProgress) => void;
  onMeasurementSignal?: (arg0: MeasurementSignal) => void;
  onMovingWarning?: (arg0: MovingWarning) => void;
  onBloodPressure?: (arg0: BloodPressure) => void;
  onSignalQuality?: (arg0: SignalQuality) => void;
  onInterferenceWarning?: (arg0: InterferenceWarning) => void;
  onUnstableConditionsWarning?: (arg0: UnstableConditionsWarning) => void;
}

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
