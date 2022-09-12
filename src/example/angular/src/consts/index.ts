export const SCHEMA = [{
  name: 'Heart Rate',
  longName: 'Heart Rate',
  key: 'bpm',
  sign: 'BPM',
  icon: 'heart.svg',
  iconResult: 'heart-result.svg',
}, {
  name: 'Respiration rate',
  longName: 'Respiration Rate',
  key: 'rr',
  sign: 'RPM',
  icon: 'resp-rate.svg',
  iconResult: 'resp-rate-result.svg',
}, {
  name: 'Oxygen',
  longName: 'SpO2',
  key: 'oxygen',
  sign: '%',
  icon: 'oxygen.svg',
  iconResult: 'oxygen-result.svg',
}, {
  name: 'Stress',
  longName: 'Stress',
  key: 'stressStatus',
  sign: '',
  icon: 'stress.svg',
  iconResult: 'stress-result.svg',
}, {
  name: 'Blood Pressure',
  longName: 'Blood Pressure',
  key: 'bloodPressureStatus',
  sign: '',
  icon: 'pressure.svg',
  iconResult: 'pressure-result.svg',
}]

export const BUTTON_TYPES = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
}

export const NO_DATA = 'NO_DATA'

// Chart colors
export const CHART_WIDTH = 255
export const CHART_HEIGHT = 127
export const CHART_COLOR = '#FFF'

export const OK = 'OK'

export const CALCULATION_TIMEOUT = 2 * 60 * 1000 // 2min
export const FPS_CHECK_TIMEOUT = 5000
export const FPS_CHECK_DONE_TIMEOUT = 1500
export const FPS_CHECK_THRESHOLD = 5

export const NOTIFICATION_TIMEOUT = 5000
export const NOTIFICATION_FACE_ORIENT_WARNING = 'NOTIFICATION_FACE_ORIENT_WARNING'
export const NOTIFICATION_FACE_SIZE_WARNING = 'NOTIFICATION_FACE_SIZE_WARNING'
export const NOTIFICATION_LOW_FPS_WARNING = 'NOTIFICATION_LOW_FPS_WARNING'
export const NOTIFICATION_INTERFERENCE_WARNING = 'NOTIFICATION_INTERFERENCE_WARNING'

export const WARNING_ERROR_LOADING = 'WARNING_ERROR_LOADING'
export const WARNING_NO_FACE_DETECTED = 'WARNING_NO_FACE_DETECTED'
export const WARNING_NO_LIVELINESS_DETECTED = 'WARNING_NO_LIVELINESS_DETECTED'

export const BPS = {
  HYP_S1: 'NORMAL',
  HYP_S2: 'ELEVATED',
  HYP_CRISIS: 'HIGH',
}
