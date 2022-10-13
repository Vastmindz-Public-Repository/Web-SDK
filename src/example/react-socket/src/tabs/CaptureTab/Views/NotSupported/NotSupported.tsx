import { Button } from '@fluentui/react-northstar'
import { Warning } from 'tabs/CaptureTab/Components'
import { useHistory } from 'react-router-dom'
import './NotSupported.scss'

export function NotSupported() {
  const history = useHistory()

  const tryAgainButtonHandler = () => {
    history.push('/capture')
  }

  return (
    <div className="not-supported-container">
      <Warning size="big">
        This device is unsupported due to a low camera frame rate. Please use this application on a different device.
      </Warning>

      <Button primary onClick={tryAgainButtonHandler} content="Back" />
    </div>
  )
}
