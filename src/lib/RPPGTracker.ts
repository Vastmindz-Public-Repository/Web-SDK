/* eslint-disable no-underscore-dangle */
import { PATH_TO_WASM } from './consts/api'
import {
  ERROR_MODULE_INITIALIZATION,
  ERROR_MODULE_NOT_INITIALIZED,
} from './consts/errors'
import Module from './module/rppg'
import {
  EmscriptenModule,
  RPPGTrackerConfig,
  RPPGTrackerInterface,
  RPPGTrackerProcessLandmarkData,
} from './RPPGTracker.types'

/**
 * Class RPPGTracker
 * @example
 * const rppgTrackerInstance = new RPPGTracker()
 */
class RPPGTracker implements RPPGTrackerInterface {
  config: RPPGTrackerConfig;

  private Module = Module;
  private module: EmscriptenModule | null = null;
  private deepColor = 4;
  private inputBuf!: number;
  private uint8Array!: Uint8ClampedArray;
  private bufferSize: number;
  private width!: number;
  private height!: number;

  /**
   * @param {RPPGTrackerConfig} config Config passed to RPPGTracker
   */
  constructor(config: RPPGTrackerConfig = {}) {
    this.width = config.width || 0
    this.height = config.height || 0
    this.config = config
    this.bufferSize = this.width * this.height * this.deepColor
  }

  /**
   * Init RPPG Tracker instance
   * @returns {Promise<void>}
   */
  async init(): Promise<void> {
    try {
      
      const moduleOptions = this.getModuleOptions()
      this.module = await new (this.Module as any)(moduleOptions) as EmscriptenModule
      if (this.module) {
        await this.module.ready
        await this.module._initTracker()
        this.initMemoryBuffer()
      }
    } catch (e) {
      this.module = null
      console.error(ERROR_MODULE_INITIALIZATION, e)
      throw Error(ERROR_MODULE_INITIALIZATION)
    }
  }

  private getModuleOptions() {
    let { pathToWasmData = PATH_TO_WASM } = this.config
    if (!pathToWasmData.endsWith('/')) {
      pathToWasmData += '/'
    }
    return {
      locateFile: (path: string) => pathToWasmData + path,
    }
  }

  private initMemoryBuffer(): void {
    if (!this.module) {
      return
    }
    this.inputBuf = this.module._malloc(this.bufferSize)
    this.uint8Array = new Uint8ClampedArray(
      this.module.HEAPU8.buffer,
      this.inputBuf,
      this.bufferSize,
    )
  }

  async processLandmarksImage(data: Uint8ClampedArray): Promise<RPPGTrackerProcessLandmarkData> {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }
    if (this.uint8Array) {
      this.uint8Array.set(data)
    }

    this.module._process_landmarks(this.inputBuf, this.width, this.height)

    const status = this.module.getStatus()
    const bgr1d = this.getBgr1d()
    const landmarks = this.getLastLandmarks()
    const face = this.getFace()

    return {
      status,
      bgr1d,
      landmarks,
      face,
    }
  }

  /**
   * getBgr1d
   * @returns {number[]}
   */
  getBgr1d(): number[] {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }
    const bgr1d = this.module.get_bgr1d()
    const bgr1dArr = []
    for (let i = 0; i < bgr1d.size(); i++) {
      bgr1dArr.push(bgr1d.get(i))
    }
    return bgr1dArr
  }

  /**
   * getLastLandmarks
   * @returns {number[]}
   */
  getLastLandmarks(): number[] {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }
    const landmarks = this.module.getLastLandmarks()
    const landmarksArr = []
    for (let i = 0; i < landmarks.size(); i++) {
      landmarksArr.push(landmarks.get(i))
    }
    return landmarksArr
  }

  /**
   * getFace
   * @returns {number[]}
   */
  getFace(): number[] {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }
    return this.module.getFace()
  }

  /**
   * getROIs
   * @returns {void[]}
   */
  getROIs(): void {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }
    // not implemented
  }
}

export default RPPGTracker
