import {
  RPPGCameraConfig,
  RPPGCameraGetFrame,
  RPPGCameraInit,
  RPPGCameraInterface,
  SourceWebcam,
} from './RPPGCamera.types'

/**
 * Class RPPGCamera
 * @example
 * const rppgCameraInstance = new RPPGCamera()
 */
class RPPGCamera implements RPPGCameraInterface {
  public config: RPPGCameraConfig

  private videoElement: HTMLVideoElement
  private canvasElement: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D | null
  private stream: MediaStream | null
  private width = 0
  private height = 0
  private useFrontCamera = true

  /**
   * @param {RPPGCameraConfig} config Config passed to RPPGCamera
   */
  constructor(config: RPPGCameraConfig) {
    this.config = config
    this.videoElement = config.videoElement || document.createElement('video')
    this.canvasElement = config.canvasElement || document.createElement('canvas')
    this.ctx = this.canvasElement.getContext('2d')
    this.stream = config.stream || null
    this.useFrontCamera = config.useFrontCamera
  }

  /**
   * Init RPPG Camera instance
   * 
   * ### Usage with regular javascript
   *
   * ```javascript
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
   * ```
   * 
   * @returns {Promise<RPPGCameraInit>} Returns actual parameters of camera
   *
   */
  async init(): Promise<RPPGCameraInit> {
    try {
      if (!this.stream) {
        this.stream = await this.getWebcamStream()
      }
      this.videoElement.srcObject = this.stream
      await this.videoElement.play()
      this.width = this.videoElement.videoWidth
      this.height = this.videoElement.videoHeight
      this.canvasElement.width = this.width
      this.canvasElement.height = this.height
      this.onSuccess({
        stream: this.stream,
        width: this.width,
        height: this.height,
      })
      return {
        stream: this.stream,
        width: this.width,
        height: this.height,
      }
    } catch (error: any) {
      console.log('Error initializing webcam', error)
      this.onError(error)
      throw error
    }
  }

    /**
   * Switch Web Camera
   * 
   * ### Usage with regular javascript
   *
   * ```javascript
   * switchWebcam(true)
   * ```
   * 
   * @returns {Promise<RPPGCameraInit>} Returns actual parameters of camera
   *
   */
  async switchCamera(useFrontCamera: boolean): Promise<RPPGCameraInit | void> {
    this.close()
    this.useFrontCamera = useFrontCamera
    return this.init()
  }

  private getWebcamStream(): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: this.useFrontCamera ? SourceWebcam.user : SourceWebcam.environment,
        width: {
          ideal: this.config.width || 640,
        },
        height: {
          ideal: this.config.height || 480,
        },
      },
    })
  }

  getFrame(): RPPGCameraGetFrame | null {
    if (!this.ctx || !this.videoElement || this.width === 0) {
      return null
    }

    this.ctx.drawImage(this.videoElement, 0, 0, this.width, this.height)
    const {
      data,
    } = this.ctx.getImageData(0, 0, this.width, this.height)

    return {
      data,
      width: this.width,
      height: this.height,
    }
  }

  close(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
      this.stream = null
    }
  }

  onError(event: Error): void {
    const { onError } = this.config
    if (typeof onError === 'function') {
      onError(event)
    }
  }

  onSuccess(event: RPPGCameraInit): void {
    const { onSuccess } = this.config
    if (typeof onSuccess === 'function') {
      onSuccess(event)
    }
  }
}

export default RPPGCamera
