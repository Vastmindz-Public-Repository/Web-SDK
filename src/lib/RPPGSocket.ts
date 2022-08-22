import { SOCKET_URL } from './consts/api'
import {
  RPPGSocketConfig,
  RPPGSocketInterface,
  RPPGSocketSendMessage,
} from './RPPGSocket.types'

/**
 * Class RPPGSocketInterface
 * @example
 * const rppgSocketInstance = new RPPGSocket()
 */
class RPPGSocket implements RPPGSocketInterface {
  config: RPPGSocketConfig;
  socket!: WebSocket;

  /**
   * @param {RPPGSocketConfig} config Config passed to RPPGSocket
   */
  constructor(config: RPPGSocketConfig) {
    this.config = config
  }

  /**
   * Init RPPG Socket instance
   * 
   * ### Usage with regular javascript
   *
   * ```javascript
   * const rppgInstance = new RPPG()
   *   await this.rppgInstance.initSocket({
   *     url: 'wss://rppg-dev2.xyz/vp/bgr_signal_socket',
   *     authToken: 'token',
   *     onConnect: () => console.log('Socket connection established'),
   *     onClose: (event) => console.log('Socket connection closed', event),
   *     onError: (event) => console.log('Socket connection error', event),
   *   })
   * ```
   * 
   * @returns {Promise<Event>}
   */
  init(): Promise<Event> {
    const url = `${this.config.url || SOCKET_URL}?authToken=${this.config.authToken}&${this.config.query || ''}`
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

  /**
   * Send message to RPPG Socket
   * @returns {Promise<Event>}
   */
  send(message: RPPGSocketSendMessage): void {
    this.socket.send(JSON.stringify(message))
  }

  /**
   * Close socket connection
   */
  close(): Promise<void> {
    const {
      onClose,
    } = this.config
    return new Promise(resolve => {
      this.socket.onclose = event => {
        resolve()
        if (typeof onClose === 'function') {
          onClose(event)
        }
      }
      this.socket.close()
    })
  }
}

export default RPPGSocket
