import {
  RPPGCameraConfig,
  RPPGCameraGetFrame,
  RPPGCameraInit,
  RPPGCameraInterface,
} from './RPPGCamera.types'

class RPPGCamera implements RPPGCameraInterface {
  public config: RPPGCameraConfig

  private videoElement: HTMLVideoElement
  private canvasElement: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D | null
  private stream: MediaStream | null
  private width = 0
  private height = 0

  constructor(config: RPPGCameraConfig) {
    this.config = config
    this.videoElement = config.videoElement || document.createElement('video')
    this.canvasElement = config.canvasElement || document.createElement('canvas')
    this.ctx = this.canvasElement.getContext('2d')
    this.stream = null
  }

  async init(): Promise<RPPGCameraInit> {
    try {
      this.stream = await this.getWebcamStream()
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
    } catch (error) {
      console.log('Error initializing webcam', error)
      this.onError(error)
      throw error
    }
  }

  private getWebcamStream(): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: {
          ideal: this.config.width || 640,
        },
        height: {
          ideal: this.config.height || 480,
        }
      }
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
    }
  }

  onError(event: Error) {
    const { onError } = this.config
    if (typeof onError === 'function') {
      onError(event)
    }
  }

  onSuccess(event: RPPGCameraInit) {
    const { onSuccess } = this.config
    if (typeof onSuccess === 'function') {
      onSuccess(event)
    }
  }
}

export default RPPGCamera
