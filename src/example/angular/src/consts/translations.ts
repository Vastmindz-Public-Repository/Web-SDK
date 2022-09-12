import {
  NOTIFICATION_FACE_ORIENT_WARNING,
  NOTIFICATION_FACE_SIZE_WARNING,
  NOTIFICATION_INTERFERENCE_WARNING,
  NOTIFICATION_LOW_FPS_WARNING,
  WARNING_ERROR_LOADING,
  WARNING_NO_FACE_DETECTED,
  WARNING_NO_LIVELINESS_DETECTED,
} from "."

export const translations = {
  en: {
    notifications: {
      [NOTIFICATION_LOW_FPS_WARNING]: 'Low FPS warning',
      [NOTIFICATION_INTERFERENCE_WARNING]: 'Bad reading, please try again in better conditions',
      [NOTIFICATION_FACE_ORIENT_WARNING]: 'Please look straight ahead',
      [NOTIFICATION_FACE_SIZE_WARNING]: 'Please move closer to the camera',
    },
    warnings: {
      [WARNING_ERROR_LOADING]: 'Error loading. Try to refresh the page',
      [WARNING_NO_FACE_DETECTED]: 'No face detected',
      [WARNING_NO_LIVELINESS_DETECTED]: 'No liveliness detected',
    },
    buttonValue: {
      INIT: 'Loading',
      START: 'Take test',
      STOP: 'Stop',
    },
    signalStatus: {
      WEAK_SIGNAL: 'Weak signal quality',
      INITIALIZING: 'Initializing...',
      MEASURING: 'Measuring..',
    },
    bpm: 'Heart Rate',
    rr: 'Breathing rate',
    oxygen: 'Blood oxygen',
    stressStatus: 'Stress',
    bloodPressureStatus: 'Blood Pressure',
    description1: 'Please keep your face in the oval',
    description2: 'Ensure your face is well lit',
    description3: 'Ensure your device is held steady',
    status: 'Status',
  },
  fr: {
    notifications: {
      [NOTIFICATION_LOW_FPS_WARNING]: 'fr Low FPS warning',
      [NOTIFICATION_INTERFERENCE_WARNING]: 'fr Bad reading, please try again in better conditions',
      [NOTIFICATION_FACE_ORIENT_WARNING]: 'frPlease look straight ahead',
      [NOTIFICATION_FACE_SIZE_WARNING]: 'frPlease move closer to the camera',
    },
    warnings: {
      [WARNING_ERROR_LOADING]: 'frError loading. Try to refresh the page',
      [WARNING_NO_FACE_DETECTED]: 'frNo face detected',
      [WARNING_NO_LIVELINESS_DETECTED]: 'frNo liveliness detected',
    },
    buttonValue: {
      INIT: 'fr Loading',
      START: 'fr Start',
      STOP: 'fr Stop',
    },
    signalStatus: {
      WEAK_SIGNAL: 'fr Weak signal quality',
      INITIALIZING: 'fr Initializing...',
      MEASURING: 'fr Measuring..',
    },
    bpm: 'fr Heart Rate',
    rr: 'fr Resp. Rate',
    oxygen: 'fr SpO2',
    stressStatus: 'fr Stress',
    bloodPressureStatus: 'fr Blood Pressure',
    description1: 'fr Please keep your face in the oval',
    description2: 'fr Ensure your face is well lit',
    description3: 'fr Ensure your device is held steady',
    status: 'fr Status',
  },
}

