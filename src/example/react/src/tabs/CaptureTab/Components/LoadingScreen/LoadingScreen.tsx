import {
  loadingScreenDelay,
  loadingScreenMessages,
  spinnerCssOverride,
  spinnerSize,
  spinnerSpeedMultiplier,
} from 'helpers/loadingScreen'
import { useEffect, useState } from 'react'
import ClipLoader from 'react-spinners/ClipLoader'
import './LoadingScreen.scss'

export function LoadingScreen() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(step =>
        step >= loadingScreenMessages.length - 1 ? 0 : step + 1
      )
    }, loadingScreenDelay)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="loading-screen-container">
      <div className="spinner-wrapper">
        <ClipLoader
          speedMultiplier={spinnerSpeedMultiplier}
          size={spinnerSize}
          cssOverride={spinnerCssOverride}
        />
      </div>
      <div className="message-wrapper">
        {loadingScreenMessages[step]}
      </div>
    </div>
  )
}
