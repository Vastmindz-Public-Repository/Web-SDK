import { RPPGMessageType } from "../RPPGEvents.types"

export const EVENTS = {
  [RPPGMessageType.ACCESS_TOKEN]: 'accessToken',
  [RPPGMessageType.MEASUREMENT_MEAN_DATA]: 'onMeasurementMeanData',
  [RPPGMessageType.MEASUREMENT_STATUS]: 'onMeasurementStatus',
  [RPPGMessageType.SENDING_RATE_WARNING]: 'onSendingRateWarning',
  [RPPGMessageType.MEASUREMENT_PROGRESS]: 'onMeasurementProgress',
  [RPPGMessageType.MEASUREMENT_SIGNAL]: 'onMeasurementSignal',
  [RPPGMessageType.MOVING_WARNING]: 'onMovingWarning',
  [RPPGMessageType.BLOOD_PRESSURE]: 'onBloodPressure',
  [RPPGMessageType.UNSTABLE_CONDITIONS_WARNING]: 'onUnstableConditionsWarning',
  [RPPGMessageType.INTERFERENCE_WARNING]: 'onInterferenceWarning',
  [RPPGMessageType.FACE_ORIENT_WARNING]: 'onFaceOrientWarning',
  [RPPGMessageType.FACE_SIZE_WARNING]: 'onFaceSizeWarning',
  [RPPGMessageType.SIGNAL_QUALITY]: 'onSignalQuality',
  [RPPGMessageType.HRV_METRICS]: 'onHrvMetrics',
  [RPPGMessageType.STRESS_INDEX]: 'onStressIndex',
  [RPPGMessageType.AFIB_RISK]: 'onAfibRisk',
}

export const EVENT_NOTIFICATION_INTERVAL = 5000
