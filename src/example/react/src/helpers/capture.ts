import { translationObj } from 'consts/translation'

export const FPS_CHECK_TIMEOUT = 5000
export const FPS_CHECK_DONE_TIMEOUT = 1500
export const FPS_CHECK_THRESHOLD = 5

export const SCHEMA: Schema[] = [{
  name: 'Heart Rate',
  longName: 'Heart Rate',
  key: 'measurementData.bpm',
  sign: 'BPM',
  icon: 'heart.svg',
  iconResult: 'heart-result.svg',
}, {
  name: 'Breathing rate',
  longName: 'Respiration Rate',
  key: 'measurementData.rr',
  sign: 'RPM',
  icon: 'resp-rate.svg',
  iconResult: 'resp-rate-result.svg',
}, {
//   name: 'Oxygen',
//   longName: 'Blood oxygen',
//   key: 'measurementData.oxygen',
//   sign: '%',
//   icon: 'oxygen.svg',
//   iconResult: 'oxygen-result.svg',
// }, {
  name: 'HRV SDNN',
  longName: 'HRV SDNN',
  key: 'hrvMetrics.sdnn',
  sign: 'ms',
  icon: 'sdnn.svg',
  iconResult: 'sdnn-result.svg',
}, {
  name: 'Stress',
  longName: 'Stress',
  key: 'measurementData.stressStatus',
  sign: '',
  icon: 'stress.svg',
  iconResult: 'stress-result.svg',
// }, {
//   name: 'Blood Pressure',
//   longName: 'Blood Pressure',
//   key: 'bloodPressureStatus',
//   sign: '',
//   icon: 'pressure.svg',
//   iconResult: 'pressure-result.svg',
}]

export const CALCULATION_TIMEOUT = 2 * 60 * 1000 // 2min

export const NOTIFICATION_TIMEOUT = 5000
export const NOTIFICATION_FACE_ORIENT_WARNING = 'NOTIFICATION_FACE_ORIENT_WARNING'
export const NOTIFICATION_FACE_SIZE_WARNING = 'NOTIFICATION_FACE_SIZE_WARNING'
export const NOTIFICATION_LOW_FPS_WARNING = 'NOTIFICATION_LOW_FPS_WARNING'
export const NOTIFICATION_INTERFERENCE_WARNING = 'NOTIFICATION_INTERFERENCE_WARNING'

export interface Schema {
  name: string;
  longName: string;
  key: string;
  sign: string;
  icon: string;
  iconResult: string;
}

// todo lang from context
export const getSchema = (lang = 'en'): Schema[] => {
  return SCHEMA.map(item => ({
    ...item,
    // @ts-ignore
    name: translationObj[lang][item.key],
  }))
}
