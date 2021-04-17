import { RPPGCameraConfig } from './RPPGCamera.types'
import { AccessToken, BloodPressure, HrvMetrics, InterferenceWarning, MeasurementMeanData, MeasurementProgress, MeasurementSignal, MeasurementStatus, MovingWarning, RPPGSocketConfig, SendingRateWarning, SignalQuality, UnstableConditionsWarning } from './RPPGSocket.types'
import { RPPGTrackerConfig, RPPGTrackerProcessLandmarkData } from './RPPGTracker.types'

export interface RPPGOnFrame {
  rppgTrackerData: RPPGTrackerProcessLandmarkData;
  instantFps: number;
  averageFps: number;
  timestamp: number;
}

export interface RPPGConfig {
  rppgTrackerConfig?: RPPGTrackerConfig;
  rppgSocketConfig?: RPPGSocketConfig;
  rppgCameraConfig?: RPPGCameraConfig;
  onFrame?: (data: RPPGOnFrame) => void;
  onAccessToken?: (arg0: AccessToken) => void;
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
  onHrvMetrics?: (arg0: HrvMetrics) => void;
}

export interface RPPGinterface {
  config: RPPGConfig;
  start: () => void;
  stop: () => void;
  init: () => Promise<void>;
  initTracker(rppgTrackerConfig: RPPGTrackerConfig): Promise<void>;
  initSocket(rppgSocketConfig: RPPGSocketConfig): Promise<Event>;
  initCamera(rppgCameraConfig: RPPGCameraConfig): Promise<void>;
  closeCamera(): void;
}
