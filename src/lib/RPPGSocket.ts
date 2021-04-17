import { SOCKET_URL } from './consts/api'
import {
  RPPGSocketConfig,
  RPPGSocketInterface,
  RPPGSocketSendMessage,
} from './RPPGSocket.types'

const events = {
  ACCESS_TOKEN: 'accessToken',
  MEASUREMENT_MEAN_DATA: 'onMeasurementMeanData',
  MEASUREMENT_STATUS: 'onMeasurementStatus',
  SENDING_RATE_WARNING: 'onSendingRateWarning',
  MEASUREMENT_PROGRESS: 'onMeasurementProgress',
  MEASUREMENT_SIGNAL: 'onMeasurementSignal',
  MOVING_WARNING: 'onMovingWarning',
  BLOOD_PRESSURE: 'onBloodPressure',
  UNSTABLE_CONDITIONS_WARNING: 'onUnstableConditionsWarning',
  INTERFERENCE_WARNING: 'onInterferenceWarning',
  SIGNAL_QUALITY: 'onSignalQuality',
  HRV_METRICS: 'hrvMetrics',
}

class RPPGSocket implements RPPGSocketInterface {
  config: RPPGSocketConfig;
  socket!: WebSocket;

  constructor(config: RPPGSocketConfig) {
    this.config = config
  }

  init(): Promise<Event> {
    const url = `${this.config.url || SOCKET_URL}?authToken=${this.config.authToken}`
    const socket = new WebSocket(url)
    this.socket = socket

    const {
      onConnect,
      onClose,
      onMessage,
      onError,
    } = this.config

    return new Promise((resolve, reject) => {
      socket.onopen = (event) => {
        if (typeof onConnect === 'function') {
          onConnect(event)
        }
        resolve(event)
      }

      socket.onclose = (event) => {
        if (typeof onClose === 'function') {
          onClose(event)
        }
      }

      socket.onmessage = (event) => {
        const { messageType, data } = JSON.parse(event.data) as { messageType: string; data: any}
        if (typeof onMessage === 'function') {
          onMessage(messageType, data)
        }

        // TODO optimize
        // @ts-ignore
        const func = this.config[events[messageType]]
        if (func && typeof func === 'function') {
          func(data)
        }
      }

      socket.onerror = (event) => {
        if (typeof onError === 'function') {
          onError(event)
        }
        reject(event)
      }
    })
  }

  send(message: RPPGSocketSendMessage): void {
    this.socket.send(JSON.stringify(message))
  }
}

export default RPPGSocket
