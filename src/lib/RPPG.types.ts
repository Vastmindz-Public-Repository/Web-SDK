import { RPPGCameraConfig } from './RPPGCamera.types'
import { RPPGSocketConfig } from './RPPGSocket.types'
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
