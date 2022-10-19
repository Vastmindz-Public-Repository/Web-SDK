import { Button } from '@fluentui/react-northstar'
import { Warning } from 'tabs/CaptureTab/Components'
import { useHistory, useLocation } from 'react-router-dom'
import './ErrorNotification.scss'
import { useEffect, useState } from 'react'

export function ErrorNotification() {
  const history = useHistory()
  const location = useLocation()

  const [message, setMessage] = useState<string>()

  useEffect(() => {
    const msg = location.state as string
    if (!msg) {
      history.push('/capture')
      return
    }

    setMessage(msg)
  }, [history, location.state])

  const tryAgainButtonHandler = () => {
    history.push('/capture')
  }

  return (
    <div className="error-notification-container">
      <Warning size="big">
        {message}
      </Warning>

      <Button primary onClick={tryAgainButtonHandler} content="Try again" />
    </div>
  )
}
