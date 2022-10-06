import RPPGCamera from './RPPGCamera'
import RPPGSocket from './RPPGSocket'
import RPPGTracker from './RPPGTracker'
import {
  RPPGConfig,
  RPPGinterface,
  RPPGOnFrame,
} from './RPPG.types'
import {
  RPPGCameraConfig,
  RPPGCameraInit,
  RPPGCameraInterface,
} from './RPPGCamera.types'
import {
  RPPGSocketConfig,
  RPPGSocketInterface,
} from './RPPGSocket.types'
import {
  RPPGTrackerConfig,
  RPPGTrackerInterface,
} from './RPPGTracker.types'
import { EVENTS } from './consts/events'
import { MessageEvents } from './RPPGEvents.types'

/**
 * Class RPPG
 * @example
 * const rppgInstance = window.rppgInstance = new rppg({
 *   onFrame: (data) => console.log('onFrame', data),
 *   onMeasurementProgress: (data) => console.log('onMeasurementProgress', data),
 *   onMeasurementMeanData: (data) => console.log('onMeasurementMeanData', data),
 * })
 * await rppgInstance.initCamera({
 *   width: 640,
 *   height: 480,
 *   videoElement: videoElement,
 *   canvasElement: canvasElement,
 * })
 * await rppgInstance.initTracker({
 *   pathToWasmData: 'https://websdk1.blob.core.windows.net/sdk-1-1-2/',
 * })
 * await this.rppgInstance.initSocket({
 *   url: 'wss://rppg-dev2.xyz/vp/bgr_signal_socket',
 *   authToken: 'token',
 *   onConnect: () => console.log('Socket connection established'),
 *   onClose: (event) => console.log('Socket connection closed', event),
 *   onError: (event) => console.log('Socket connection error', event),
 * })
 * this.rppgInstance.start()
 */
class RPPG implements RPPGinterface {
  /**
   * config
   */
  public config: RPPGConfig;

  /**
   * true, when tracking is active
   */
  public processing: boolean

  /**
   * RPPG version
   */
  public version: string

  private rppgCamera: RPPGCameraInterface | null = null;
  private rppgTracker: RPPGTrackerInterface | null = null;
  private rppgSocket: RPPGSocketInterface | null = null;

  private width = 0
  private height = 0
  private frameNumber = 0
  private averageFps = 0
  private timestamp = 0
  private startTimeStamp = 0
  private instantFps = 0

  /**
   * @param {RPPGConfig} config Config passed to RPPG
   */
  constructor(config: RPPGConfig = {}) {
    this.config = config
    this.version = '0.0.0'
    this.processing = false
    // TODO verify config
  }

  async init(): Promise<void> {
    const {
      serverless = false,
      rppgTrackerConfig,
      rppgSocketConfig,
      rppgCameraConfig,
    } = this.config
    if (!rppgTrackerConfig || (!rppgSocketConfig && !serverless) || !rppgCameraConfig) {
      console.log('Error initializing - incorrect configuration')
      // TODO
      return
    }
    try {
      await this.initCamera(rppgCameraConfig)
      await this.initTracker(rppgTrackerConfig)
      if (!serverless && rppgSocketConfig) {
        await this.initSocket(rppgSocketConfig)
      }
    } catch (error) {
      console.log('Error initializing RPPG', error)
    }
  }

  /**
   * Initialize RPPG Tracker instance
   * @param {RPPGTrackerConfig} rppgTrackerConfig
   * @return {Promise<void>}
   * @example
   * const rppgInstance = new RPPG()
   * await rppgInstance.initTracker({
   *   pathToWasmData: 'https://websdk1.blob.core.windows.net/sdk-1-1-2/',
   * })
   */
  initTracker(rppgTrackerConfig: RPPGTrackerConfig = {}): Promise<void> {
    if (this.rppgTracker) {
      // TODO
      console.log('Error initializing - rppgTracker is already initialized')
      return Promise.reject()
    }
    if (!this.width) {
      console.log('Error initializing - rppgCamera should be initialized before initTracker')
      return Promise.reject()
    }
    this.rppgTracker = new RPPGTracker({
      ...rppgTrackerConfig,
      width: this.width,
      height: this.height,
      serverless: this.config.serverless,
      onEvent: this.onEvent.bind(this),
    })
    return this.rppgTracker.init()
  }

  /**
   * Initialize RPPG Socket instance
   * @param {RPPGSocketConfig} rppgSocketConfig Socket configuration
   * @return {Promise<Event>}
   * @example
   * const rppgInstance = new RPPG()
   *   await this.rppgInstance.initSocket({
   *     url: 'wss://rppg-dev2.xyz/vp/bgr_signal_socket',
   *     authToken: 'token',
   *     onConnect: () => console.log('Socket connection established'),
   *     onClose: (event) => console.log('Socket connection closed', event),
   *     onError: (event) => console.log('Socket connection error', event),
   *   })
   * 
   */
  async initSocket(rppgSocketConfig: RPPGSocketConfig): Promise<Event> {
    if (this.rppgSocket) {
      console.log('Re-inititialize socket connection')
      this.processing = false
      await this.rppgSocket.close()
    }
    this.rppgSocket = new RPPGSocket({
      ...rppgSocketConfig,
      onEvent: this.onEvent.bind(this),
    })
    return this.rppgSocket.init()
  }

  /**
   * Initialize RPPG Camera instance
   * @param {RPPGCameraConfig} rppgCameraConfig
   * @return {Promise<void>}
   * @example
   * const rppgInstance = new RPPG()
   * const {
   *   width,
   *   height,
   *   stream
   * } = await rppgInstance.initCamera({
   *   width: 640,
   *   height: 480,
   *   videoElement: document.querySelector('video'),
   *   canvasElement: document.querySelector('canvas'),
   *   onSuccess: data => console.log('Initializing camera success', data),
   *   onError: error => console.error('Error initializing camera', error)
   * })
   *
   */
  async initCamera(rppgCameraConfig: RPPGCameraConfig): Promise<void> {
    if (this.rppgCamera) {
      // TODO
      console.log('Error initializing - rppgCamera is already initialized')
      return
    }
    this.rppgCamera = new RPPGCamera(rppgCameraConfig)
    const {
      width,
      height,
    } = await this.rppgCamera.init()
    this.width = width
    this.height = height
  }

  /**
   * Close camera stream
   * @return {void}
   */
  closeCamera(): void {
    if (this.rppgCamera) {
      this.rppgCamera.close()
    }
  }

  /**
   * Switch web camera
   * @return {void}
   */
  switchCamera(useFrontCamera: boolean): Promise<RPPGCameraInit | void> {
    if (this.rppgCamera) {
      return this.rppgCamera.switchCamera(useFrontCamera)
    }
    return Promise.resolve()
  }

  /**
   * Switch serverless without rppg instance reinitialisation
   * @return {void}
   */
  switchServerless(serverless: boolean): void {
    if (this.rppgTracker) {
      this.config.serverless = serverless
      this.rppgTracker.config.serverless = serverless
    }
  }

  /**
   * Start tracking
   * @return {void}
   */
  public start(): void {
    this.processing = true
    this.frameNumber = 0
    this.averageFps = 0
    this.timestamp = 0
    this.startTimeStamp = new Date().getTime()
    this.rppgTracker?.reInit()
    this.capture()
  }

  /**
   * Stop tracking
   * @return {void}
   */
  public stop(): void {
    this.processing = false
  }

  private async capture(): Promise<void> {
    if (this.processing) {
      requestAnimationFrame(this.capture.bind(this))
    }

    if (this.width === 0 || !this.rppgCamera || !this.rppgTracker || (!this.config.serverless && !this.rppgSocket)) {
      // TODO error
      return
    }

    const timestamp = new Date().getTime()
    this.instantFps = +(1000 / (timestamp - this.timestamp)).toFixed(2)
    this.timestamp = timestamp

    const frame = this.rppgCamera.getFrame()

    if (!frame) {
      return
    }

    const relativeTimestamp = this.timestamp - this.startTimeStamp

    const rppgTrackerData = await this.rppgTracker.processFrame(frame.data, relativeTimestamp)

    if (!this.config.skipSocketWhenNoFace ||
        (rppgTrackerData.status !== 1 && rppgTrackerData.status !== 2)) {
      this.rppgSocket?.send({
        bgrSignal: rppgTrackerData.bgr1d,
        timestamp,
      })
    }

    this.onFrame({
      rppgTrackerData,
      instantFps: this.instantFps,
      averageFps: this.averageFps,
      timestamp: this.timestamp,
    })

    this.frameNumber++
    // eslint-disable-next-line max-len
    this.averageFps = +((1000 * this.frameNumber) / relativeTimestamp).toFixed(2)
  }

  /**
   * Describe your function
   * @param {RPPGOnFrame} data
   * @return {void}
   * @example
   * const rppgInstance = new rppg({
   *   onFrame: (data) => console.log('onFrame', data),
   * })
   */
  onFrame(data: RPPGOnFrame): void {
    if (typeof this.config.onFrame === 'function') {
      this.config.onFrame(data)
    }
  }

  private onEvent(
    eventType: string,
    event: MessageEvents,
  ) {
    // TODO optimize
    // @ts-ignore
    const func = this.config[EVENTS[eventType]]
    if (func && typeof func === 'function') {
      func(event)
    }
  }
}

export default RPPG
