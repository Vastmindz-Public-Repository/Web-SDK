import './Notification.scss'

type Props = {
  message: string
}

export const Notification: React.FC<Props> = ({message}) => {
  return (
    <div className="notification-container">
      <div className="notification">
        {message}
      </div>
      <div className="notification-type">
        <p className="notification-type-text">Warning</p>
      </div>
    </div>
  )
}
