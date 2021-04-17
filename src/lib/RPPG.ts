import RPPGCamera from './RPPGCamera'
import RPPGSocket from './RPPGSocket'
import RPPGTracker from './RPPGTracker'
import { RPPGConfig, RPPGinterface, RPPGOnFrame } from './RPPG.types'
import { RPPGCameraConfig, RPPGCameraInterface } from './RPPGCamera.types'
import { RPPGSocketConfig, RPPGSocketInterface } from './RPPGSocket.types'
import { RPPGTrackerConfig, RPPGTrackerInterface } from './RPPGTracker.types'

class RPPG implements RPPGinterface {
  config: RPPGConfig;
  processing = false

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

  constructor(config: RPPGConfig = {}) {
    this.config = config
    // TODO verify config
  }

  async init() {
    const {
      rppgTrackerConfig,
      rppgSocketConfig,
      rppgCameraConfig,
    } = this.config
    if (!rppgTrackerConfig || !rppgSocketConfig || !rppgCameraConfig) {
      console.log('Error initializing - incorrect configuration')
      // TODO
      return
    }
    try {
      await this.initCamera(rppgCameraConfig)
      await this.initTracker(rppgTrackerConfig)
      await this.initSocket(rppgSocketConfig)
    } catch (error) {
      console.log('Error initializing RPPG', error)
    }
  }

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
    })
    return this.rppgTracker.init()
  }

  initSocket(rppgSocketConfig: RPPGSocketConfig): Promise<Event> {
    if (this.rppgSocket) {
      // TODO
      console.log('Error initializing - rppgSocket is already initialized')
      return Promise.reject()
    }
    this.rppgSocket = new RPPGSocket(rppgSocketConfig)
    return this.rppgSocket.init()
  }

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

  closeCamera() {
    if (this.rppgCamera) {
      this.rppgCamera.close()
    }
  }

  public start(): void {
    console.log('start')
    this.processing = true
    this.frameNumber = 0
    this.averageFps = 0
    this.timestamp = 0
    this.startTimeStamp = new Date().getTime()
    this.capture()
  }

  public stop(): void {
    console.log('stop')
    this.processing = false
  }

  async capture() {
    if (this.processing) {
      requestAnimationFrame(this.capture.bind(this))
    }

    if (this.width === 0 || !this.rppgCamera || !this.rppgTracker || !this.rppgSocket) {
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

    const rppgTrackerData = await this.rppgTracker.processLandmarksImage(frame.data)

    this.rppgSocket.send({
      bgrSignal: rppgTrackerData.bgr1d,
      timestamp,
    })

    this.onFrame({
      rppgTrackerData,
      instantFps: this.instantFps,
      averageFps: this.averageFps,
      timestamp: this.timestamp,
    })

    this.frameNumber++
    // eslint-disable-next-line max-len
    this.averageFps = +((1000 * this.frameNumber) / (this.timestamp - this.startTimeStamp)).toFixed(2)
  }

  onFrame(data: RPPGOnFrame) {
    if (typeof this.config.onFrame === 'function') {
      this.config.onFrame(data)
    }
  }
}

export default RPPG
