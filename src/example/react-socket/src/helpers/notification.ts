export interface Notification {
  message: string
  timer: NodeJS.Timeout
}

export interface NotificationsResult {
  notification: Notification
  addNotification: (type: string) => void
  clearNotification: (type: string) => void
  clearAllNotifications: () => void
}

export const NOTIFICATION_TIMEOUT = 2000

export const NOTIFICATION_NO_FACE_DETECTED = 'No face detected'
export const NOTIFICATION_INTERFERENCE_WARNING = 'Bad reading, please try again in better conditions'
export const NOTIFICATION_FACE_ORIENT_WARNING = 'Please look straight ahead'
export const NOTIFICATION_FACE_SIZE_WARNING = 'Please move closer to the camera'
