import { calculatingMessages, intervalDelay, serviceMessages } from 'helpers/textMessage'
import { useEffect, useRef, useState } from 'react'
import './TextMessage.scss'

export enum ProgressType {
  START = 'start',
  CALIBRATING = 'calibrating',
  CALCULATING = 'calculating'
}

export interface TextMessageProps {
  progressType: ProgressType
}

export function TextMessage({
  progressType = ProgressType.START,
}: TextMessageProps) {

  const [step, setStep] = useState(0)
  const [message, setMessage] = useState(serviceMessages[0])
  const interval = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (progressType === ProgressType.START) {
      setMessage(serviceMessages[0])
      return
    }
    if (progressType === ProgressType.CALIBRATING) {
      setMessage(serviceMessages[1])
      return
    }
    setMessage(calculatingMessages[step])
  }, [step, progressType])

  useEffect(() => {
    let isMounted = true
    if (progressType !== ProgressType.CALCULATING) {
      clearInterval(interval.current)
      return
    }
    if (!interval.current) {
      setStep(0)

      setInterval(() => isMounted && setStep(step =>
        step >= calculatingMessages.length - 1 ? 0 : step + 1
      ), intervalDelay)
    }

    return () => {
      isMounted = false
    }
  }, [progressType])

  return (
    <div className="text-message-container">
      <div className="text-message">
        <p className="welcome-title">{message.title}</p>
        <p className="welcome-description">{message.description}</p>
      </div>
    </div>
  )
}
