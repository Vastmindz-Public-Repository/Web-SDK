/* eslint-disable no-underscore-dangle */
import { throttle, mergeWith } from 'lodash'
import { PATH_TO_WASM } from './consts/api'
import {
  ERROR_MODULE_INITIALIZATION,
  ERROR_MODULE_NOT_INITIALIZED,
} from './consts/errors'
import { EVENT_NOTIFICATION_INTERVAL } from './consts/events'
import Module from './module/rppg'
import {
  BloodPressure,
  HrvMetrics,
  MeasurementMeanData,
  MeasurementProgress,
  MeasurementSignal,
  SignalQuality,
  StressIndex,
  BloodPressureStatus,
  StressStatus,
  RPPGMessageType,
} from './RPPGEvents.types'
import {
  EmscriptenModule,
  ImageQualityFlags,
  RPPGTrackerConfig,
  RPPGTrackerInterface,
  RPPGTrackerProcessFrameData,
} from './RPPGTracker.types'

export interface MeanData {
  bpm_mean: number
  rr_mean: number
  oxygen_mean: number
}

const STATUS = {
  ALL_VITALS_CALCULATED: 0,   //!< ALL vitals calculated(hr, rr& spO2 displayed) -> Calculating vitals�
  NO_FACE: 1,   //!< No face detected
  FACELOST: 2,   //!< face was lost
  ANALYZING: 3,   //!< 1st calibration with % progress -> Analyzing PPG signals�50%
  REACLIBRATING: 4,   //!< >1 calibration with %progress  -> Recalibrating�50%
  BRIGHT_LIGHT_DETECTED: 5,   //!< Bright light detected
  NOISE_DETECTED: 6,   //!< Noise detected during execution -> Interference detected
  WRONG_INPUTS: 7,    //!< wrong inputs
}

const STATUSES = [
  {code: 'SUCCESS', message: 'Success'},
  {code: 'NO_FACE', message: 'No face detected'},
  {code: 'FACE_LOST', message: 'Face was lost'},
  {code: 'CALIBRATING', message: 'Calibrating'},
  {code: 'RECALIBRATING', message: 'Recalibrating'},
  {code: 'BRIGHT_LIGHT_ISSUE', message: 'Bright light detected'},
  {code: 'NOISE_DURING_EXECUTION', message: 'Interference detected'},
  {code: 'UNKNOWN', message: 'Wrong inputs'},
]

const BP_STATUS = {
  [-1]: 'NO_DATA',
  0: 'NORMAL',
  1: 'ELEVATED',
  2: 'HYP_S1',
  3: 'HYP_S2',
  4: 'HYP_CRISIS',
}

const STRESS_STATUS = 	{
  [-1]: 'NO_DATA',
  0: 'LOW',
  1: 'NORMAL',
  2: 'ELEVATED',
  3: 'VERY_HIGH',
}

const DEFAULT_MEAN_DATA: MeanData = {
  bpm_mean: 0,
  rr_mean: 0,
  oxygen_mean: 0,
}

const DEFAULT_STRESS_STATUS = -1

const DEFAULT_BLOOD_PRESSURE_STATUS = BloodPressureStatus.NO_DATA

const DEFAULT_HRV_METRICS = {
  ibi: -1,
  rmssd: -1,
  sdnn: -1,
}

const DEFAULT_STRESS_INDEX = 0

/**
 * Class RPPGTracker
 * @example
 * const rppgTrackerInstance = new RPPGTracker()
 */
class RPPGTracker implements RPPGTrackerInterface {
  config: RPPGTrackerConfig;

  private Module = Module
  private module: EmscriptenModule | null = null
  private deepColor = 4
  private inputBuf!: number
  private uint8Array!: Uint8ClampedArray
  private bufferSize: number
  private width!: number
  private height!: number
  private unstableTimeout!: NodeJS.Timeout | null
  private unstableTimeoutLimit!: number
  
  private previousMeanData: MeanData
  private previousStressStatus: StressStatus
  private previousBloodPressureStatus: BloodPressureStatus
  private previousHrvMetrics: HrvMetrics
  private previousStressIndex: number

  /**
   * @param {RPPGTrackerConfig} config Config passed to RPPGTracker
   */
  constructor(config: RPPGTrackerConfig = {}) {
    this.width = config.width || 0
    this.height = config.height || 0
    this.config = config
    this.bufferSize = this.width * this.height * this.deepColor
    this.unstableTimeout = null
    this.unstableTimeoutLimit = 15000

    this.previousMeanData = {...DEFAULT_MEAN_DATA}
    this.previousStressStatus = DEFAULT_STRESS_STATUS
    this.previousBloodPressureStatus = DEFAULT_BLOOD_PRESSURE_STATUS
    this.previousHrvMetrics = {...DEFAULT_HRV_METRICS}
    this.previousStressIndex = DEFAULT_STRESS_INDEX
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

  reInit(): void {
    this.previousMeanData = {...DEFAULT_MEAN_DATA}
    this.previousStressStatus = DEFAULT_STRESS_STATUS
    this.previousBloodPressureStatus = DEFAULT_BLOOD_PRESSURE_STATUS
    this.previousHrvMetrics = {...DEFAULT_HRV_METRICS}
    this.previousStressIndex = DEFAULT_STRESS_INDEX
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

  private sendFaceOrientWarningNotification = throttle(() =>
      this.config.onEvent && this.config.onEvent(RPPGMessageType.FACE_ORIENT_WARNING, {})
    , EVENT_NOTIFICATION_INTERVAL, {
      leading: true,
    })

  private sendFaceSizeWarningNotification = throttle(() =>
      this.config.onEvent && this.config.onEvent(RPPGMessageType.FACE_SIZE_WARNING, {})
    , EVENT_NOTIFICATION_INTERVAL, {
      leading: true,
    })

  async processFrame(data: Uint8ClampedArray, timestamp: number): Promise<RPPGTrackerProcessFrameData> {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }
    if (this.uint8Array) {
      this.uint8Array.set(data)
    }

    if (this.config.serverless) {
      this.module._track(this.inputBuf, this.width, this.height, timestamp)
    } else {
      this.module._process_landmarks(this.inputBuf, this.width, this.height, timestamp)
    }

    const eyeBlinkStatus = this.getEyeBlinkStatus()
    const imageQualityFlags = this.getImageQualityFlags()
    const status = this.getStatus()
    const signal = this.getSignal(256)
    const ecg = this.getECG(256)
    // const bpm = this.getBPM()
    // const rr = this.getRR()
    // const oxygen = this.getSPO()
    // const snr = this.getSNR()
    // const bloodPressureStatus = this.getBP()
    const bloodPressureStatus = this.getBPStatus()
    const snr = this.getMeanSNR()
    const stress = this.getStress()
    const stressStatus = this.getStressStatus()
    const progressPercent = this.getProgress()
    const hrv = this.getHRVFeatures()

    const mean = this.getMean_BPM_RR_SpO2()


    if (this.config.serverless && this.config.onEvent) {
      // onMeasurementProgress
      const measurementProgressData: MeasurementProgress = {
        progressPercent,
      }
      this.config.onEvent(RPPGMessageType.MEASUREMENT_PROGRESS, measurementProgressData)

      // onMeasurementSignal
      const measurementSignalData: MeasurementSignal = {
        signal,
        ecg,
      }
      this.config.onEvent(RPPGMessageType.MEASUREMENT_SIGNAL, measurementSignalData)

      // onHrvMetrics
      const hrvMetricsData: HrvMetrics = hrv
      this.config.onEvent(RPPGMessageType.HRV_METRICS, hrvMetricsData)

      // onStressIndex
      const measurementStressData: StressIndex = {
        stress,
      }
      this.config.onEvent(RPPGMessageType.STRESS_INDEX, measurementStressData)

      // onSignalQuality
      const signalQualityData: SignalQuality = {
        snr,
      }
      this.config.onEvent(RPPGMessageType.SIGNAL_QUALITY, signalQualityData)

      // onMeasurementMeanData
      const measurementMeanData: MeasurementMeanData = {
        bpm: mean.bpm_mean,
        rr: mean.rr_mean,
        oxygen: mean.oxygen_mean,
        stressStatus,
        bloodPressureStatus,
      }
      this.config.onEvent(RPPGMessageType.MEASUREMENT_MEAN_DATA, measurementMeanData)
      
      // onMeasurementStatus
      const measurementStatusData = {
        statusCode: STATUSES[status].code,
        statusMessage: STATUSES[status].message,
      }
      this.config.onEvent(RPPGMessageType.MEASUREMENT_STATUS, measurementStatusData)

      // onBloodPressure, not implemented
      const bloodPressureData: BloodPressure = {
        systolic: 0,
        diastolic: 0,
      }
      this.config.onEvent(RPPGMessageType.BLOOD_PRESSURE, bloodPressureData)
    }

    if (status === STATUS.NOISE_DETECTED && this.config.onEvent) {
      this.config.onEvent(RPPGMessageType.UNSTABLE_CONDITIONS_WARNING, {})
      this.unstableTimeout = this.unstableTimeout ||
        setTimeout(this.config.onEvent.bind(this, RPPGMessageType.INTERFERENCE_WARNING, {})
        , this.unstableTimeoutLimit)
    } else {
      this.unstableTimeout && clearTimeout(this.unstableTimeout)
      this.unstableTimeout = null
    }

    if (!imageQualityFlags.faceOrientFlag) {
      this.sendFaceOrientWarningNotification()
    }
    if (!imageQualityFlags.faceSizeFlag) {
      this.sendFaceSizeWarningNotification()
    }
    
    const bgr1d = this.getBgr1d()
    const landmarks = this.getLastLandmarks()
    const face = this.getFace()

    return {
      eyeBlinkStatus,
      imageQualityFlags,
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
   * getImageQualityFlags
   * @returns {ImageQualityFlags}
   */
   getImageQualityFlags(): ImageQualityFlags {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }

    const imageQualityFlagsByte = this.module.getImageQualityFlags()
    return {
      brightColorFlag: Boolean(imageQualityFlagsByte & (1 << 0)),
      illumChangeFlag: Boolean(imageQualityFlagsByte & (1 << 1)),
      noiseFlag: Boolean(imageQualityFlagsByte & (1 << 2)),
      sharpFlag: Boolean(imageQualityFlagsByte & (1 << 3)),
      faceSizeFlag: Boolean(imageQualityFlagsByte & (1 << 4)),
      faceOrientFlag: Boolean(imageQualityFlagsByte & (1 << 5)),
    }
  }

  /**
   * getEyeBlinkStatus
   * @returns {boolean}
   */
  getEyeBlinkStatus(): boolean {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }
    return this.module.getEyeBlinkStatus(
      this.config.maxTimeBetweenBlinksSeconds || 20,
      this.config.detectionThreshold || 1,
    )
  }

  /**
   * getHRVFeatures
   * @returns {number[]}
   */
  getHRVFeatures(): HrvMetrics {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }
    const hrv = this.module.getHRVFeatures()
    return mergeWith(this.previousHrvMetrics, {
      ibi: hrv.get(0) ?? -1,
      rmssd: hrv.get(1) ?? -1,
      sdnn: hrv.get(2) ?? -1,
    }, (oldValue, newValue) => {
      if (newValue === -1) {
        return oldValue
      }
    })
  }

  /**
   * getMean_BPM_RR_SpO2
   * @returns {number[]}
   */
  getMean_BPM_RR_SpO2(): MeanData {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }
    const signal = this.module.getMean_BPM_RR_SpO2()
    return mergeWith(this.previousMeanData, {
      bpm_mean: Math.round(signal.get(0)),
      rr_mean: Math.round(signal.get(1)),
      oxygen_mean: Math.round(signal.get(2)),
    }, (oldValue, newValue) => {
      if (newValue === 0) {
        return oldValue
      }
    })
  }

  /**
   * getSignal
   * @returns {number[]}
   */
  getSignal(size = 128, zoom = 128): number[] {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }
    const signal = this.module.getSignal(size)
    const signalArr = []
    for (let i = 0; i < signal.size(); i++) {
      signalArr.push(signal.get(i) * zoom)
    }
    return signalArr
  }

  /**
   * getECG
   * @returns {number[]}
   */
  getECG(size = 128, zoom = 128): number[] {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }
    const ECG = this.module.getECG(size)
    const ECGArr = []
    for (let i = 0; i < ECG.size(); i++) {
      ECGArr.push(ECG.get(i) * zoom)
    }
    return ECGArr
  }

  /**
   * getPeaksIndexes
   * @returns {number[]}
   */
  getPeaksIndexes(size = 128): number[] {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }
    const peackIndexes = this.module.getPeaksIndexes(size)
    const peackIndexesArr = []
    for (let i = 0; i < peackIndexes.size(); i++) {
      peackIndexesArr.push(peackIndexes.get(i))
    }
    return peackIndexesArr
  }

  /**
   * getBPStatus
   * @returns {string}
   */
   getBPStatus(): BloodPressureStatus {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }
    // @ts-ignore
    const bpStatus = BP_STATUS[this.getBP()]

    if (bpStatus === BloodPressureStatus.NO_DATA) {
      return this.previousBloodPressureStatus
    }

    this.previousBloodPressureStatus = bpStatus
    return bpStatus
  }

  /**
   * getBP
   * @returns {number}
   */
   getBP(): number {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }
    return this.module.getBP()
  }

  /**
   * getBPM
   * @returns {number}
   */
   getBPM(): number {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }
    return this.module.getBPM()
  }

  /**
   * getSNR
   * @returns {number}
   */
   getSNR(): number {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }
    return this.module.getSNR()
  }

  /**
   * getMeanSNR
   * @returns {number}
   */
   getMeanSNR(): number {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }
    return this.module.getMeanSNR()
  }

  /**
   * getStatus
   * @returns {number}
   */
  getStatus(): number {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }
    return this.module.getStatus()
  }

  /**
   * getRR
   * @returns {number}
   */
  getRR(): number {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }
    return this.module.getRR()
  }

  /**
   * getSPO
   * @returns {number}
   */
  getSPO(): number {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }
    return this.module.getSpO2()
  }

  /**
   * getStressStatus
   * @returns {number}
   */
  getStressStatus(): StressStatus {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }
    const stressStatus = this.module.getStressStatus()
    if (stressStatus === -1) {
      // @ts-ignore
      return STRESS_STATUS[this.previousStressStatus]
    }
    
    this.previousStressStatus = stressStatus
    // @ts-ignore
    return STRESS_STATUS[stressStatus]
  }

  /**
   * getStress
   * @returns {numbe}
   */
  getStress(): number {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }
    const stress = this.module.getStress()

    if(stress === 0) {
      return this.previousStressIndex
    }

    this.previousStressIndex = stress
    return stress
  }

  /**
   * getProgress
   * @returns {number}
   */
  getProgress(): number {
    if (!this.module) {
      throw Error(ERROR_MODULE_NOT_INITIALIZED)
    }
    return Math.round(this.module.getProgress() * 100)
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
