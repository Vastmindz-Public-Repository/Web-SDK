import { SOCKET_URL } from './consts/api'
import {
  RPPGSocketConfig,
  RPPGSocketInterface,
  RPPGSocketSendMessage,
} from './RPPGSocket.types'

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
      onEvent,
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
        if (typeof onEvent === 'function') {
          onEvent(messageType, data)
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
