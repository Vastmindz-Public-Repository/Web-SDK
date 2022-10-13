import { Button } from '@fluentui/react-northstar'
import { useHistory } from 'react-router-dom'
import './BadConditions.scss'

export function BadConditions() {
  const history = useHistory()

  const tryAgainButtonHandler = () => {
    history.push('/capture')
  }

  return (
    <div className="bad-conditions-container">
      <div className="title-error">Error</div>
      <div className="message-container">
        <div className="title">Unable to take readings</div>
        <div className="content">
          This error can occur if there was too much movement in
          the camera frame or if the lighting conditions were unstable.
          Please try again in more stable conditions and ensure your face is evenly lit.
        </div>
      </div>

      <Button onClick={tryAgainButtonHandler} primary content="Try Again" />

    </div>
  )
}
