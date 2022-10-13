import { useEffect, useState } from 'react'
import { Notification, NOTIFICATION_TIMEOUT } from 'helpers/notification'

const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [message, setMessage] = useState<string | null>(null)

  const createTimer = (message: string) =>
    setTimeout(() => clearNotification(message), NOTIFICATION_TIMEOUT)

  const clearTimer = ({ timer }: Notification) =>
    timer && clearTimeout(timer)

  const addNotification = (message: string) =>
    setNotifications((notifications) => {
      const notification = notifications.find(item => item.message === message)

      if (notification) {
        clearTimer(notification)
        notification.timer = createTimer(notification.message)
        return [...notifications]
      }
      
      return [
        ...notifications,
        {
          message,
          timer: createTimer(message),
        },
      ]
    })

  const clearNotification = (message: string) =>
    setNotifications((notifications) =>
      notifications.filter(item => item.message !== message)
    )

  const clearAllNotifications = () => {
    notifications.map(clearTimer)
    setNotifications([])
  }

  useEffect(() => setMessage(notifications.length
    ? notifications[0].message
    : null), [notifications])

  return {
    message,
    addNotification,
    clearNotification,
    clearAllNotifications,
  }
}

export default useNotification
