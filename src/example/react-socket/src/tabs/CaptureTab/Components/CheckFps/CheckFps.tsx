import {
  spinnerCssOverride,
  spinnerSize,spinnerSpeedMultiplier,
} from 'helpers/loadingScreen'
import ClipLoader from 'react-spinners/ClipLoader'
import './CheckFps.scss'

export const CheckFps: React.FC = ({children}) => {
  return (
    <div className="check-fps-container">
      <p className="check-fps-message">
        {children}
      </p>
      <div className="check-fps-spinner">
        <ClipLoader
          speedMultiplier={spinnerSpeedMultiplier}
          size={spinnerSize}
          cssOverride={spinnerCssOverride}
        />
      </div>
    </div>
  )
}
