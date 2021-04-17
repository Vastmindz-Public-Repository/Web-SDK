import {
  RPPGSocketConfig,
  RPPGSocketInterface,
  RPPGSocketSendMessage,
} from './RPPGSocket.types'

const events = {
  MEASUREMENT_MEAN_DATA: 'onMeasurementMeanData',
  MEASUREMENT_STATUS: 'onMeasurementStatus',
  SENDING_RATE_WARNING: 'onSendingRateWarning',
  MEASUREMENT_PROGRESS: 'onMeasurementProgress',
  MEASUREMENT_SIGNAL: 'onMeasurementSignal',
  MOVING_WARNING: 'onMovingWarning',
  BLOOD_PRESSURE: 'onBloodPressure',
  SIGNAL_QUALITY: 'onSignalQuality',
  INTERFERENCE_WARNING: 'onInterferenceWarning',
  UNSTABLE_CONDITIONS_WARNING: 'onUnstableConditionsWarning',
}

class RPPGSocket implements RPPGSocketInterface {
  config: RPPGSocketConfig;
  socket!: WebSocket;

  constructor(config: RPPGSocketConfig) {
    this.config = config
  }

  init(): Promise<Event> {
    const url = `${this.config.url}?authToken=${this.config.authToken}`
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
        console.log('Connected', event)
        if (typeof onConnect === 'function') {
          onConnect(event)
        }
        resolve(event)
      }

      socket.onclose = (event) => {
        console.log(event)
        if (typeof onClose === 'function') {
          onClose(event)
        }
      }

      socket.onmessage = (event) => {
        // console.log(event)
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
        console.log('Error ', event)
        if (typeof onError === 'function') {
          onError(event)
        }
        reject(event)
      }
    })
  }

  send(message: RPPGSocketSendMessage) {
    this.socket.send(JSON.stringify(message))
  }
}

export default RPPGSocket
