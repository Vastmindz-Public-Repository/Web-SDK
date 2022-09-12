import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core'
import { Router } from '@angular/router'
import RPPG from 'rppg/dist/lib/RPPG'
import { RPPGOnFrame } from 'rppg/src/lib/RPPG.types'
import {
  MeasurementMeanData,
  MeasurementProgress,
  MeasurementSignal,
  SignalQuality,
} from 'rppg/dist/lib/RPPGEvents.types'
import { ImageQualityFlags } from 'rppg/dist/lib/RPPGTracker.types'
import { RPPGCameraInit } from 'rppg/dist/lib/RPPGCamera.types'
import {
  CALCULATION_TIMEOUT,
  FPS_CHECK_DONE_TIMEOUT,
  FPS_CHECK_THRESHOLD,
  FPS_CHECK_TIMEOUT,
  NOTIFICATION_FACE_ORIENT_WARNING,
  NOTIFICATION_FACE_SIZE_WARNING,
  NOTIFICATION_INTERFERENCE_WARNING,
  NOTIFICATION_LOW_FPS_WARNING,
  NOTIFICATION_TIMEOUT,
  WARNING_ERROR_LOADING,
  WARNING_NO_FACE_DETECTED,
  WARNING_NO_LIVELINESS_DETECTED,
} from 'src/consts'
import { translations } from 'src/consts/translations'
import { environment } from 'src/environments/environment'
import { ProgressType } from 'src/app/components/text-message/text-message.component'
import {
  isAllDataCalculated,
  normalizeBGRData,
  threeValuesCalculated,
} from 'src/utils'

@Component({
  selector: 'app-measurement',
  templateUrl: './measurement.component.html',
  styleUrls: ['./measurement.component.scss'],
})

export class MeasurementComponent implements OnInit {
  @ViewChild('videoElement') videoElement: ElementRef<HTMLVideoElement>

  rppgInstance = null
  authToken = environment.AUTH_TOKEN
  averageFps = 0
  maxFps = 0
  width = 640
  height = 480
  ready = false
  errorInitializing = false
  progress = 0
  bgrData: MeasurementMeanData = {
    bpm: 0,
    rr: 0,
    oxygen: 0,
    stressStatus: null,
    bloodPressureStatus: null,
  }
  signal: number[] = []
  interferenceWarning = false
  processing = false
  lang: 'en' | 'fr' = 'en'
  status = this.SIGNAL_STATUS.INITIALIZING
  isAllDataCalculated = false
  isCalculationEnded = false
  threeValuesCalculated = false
  timeoutFunction = null
  faceDetected = true
  liveliness = true
  imageQualityFlags: ImageQualityFlags = {
    brightColorFlag: false,
    illumChangeFlag: false,
    noiseFlag: false,
    sharpFlag: false,
    faceOrientFlag: false,
    faceSizeFlag: false,
  }
  useFrontCamera = true
  useLiveliness = false
  checkDeviceTimer = null
  checkDeviceDoneTimer = null
  notifications: {
    [type: string]: {
      timer: number
      message: string
      type: string
    }
  } = {}
  progressType: ProgressType = ProgressType.START

  constructor(private router: Router) {}

  get translation() {
    return translations[this.lang]
  }
  
  get SIGNAL_STATUS() {
    return this.translation['signalStatus']
  }

  get buttonIsVisible() {
    return this.ready &&
      !this.processing &&
      !this.isCalculationEnded
  }

  get warningIsVisible() {
    return !this.isCalculationEnded &&
      !this.checkDeviceTimer &&
      (!this.faceDetected ||!this.liveliness || this.errorInitializing) 
  }

  get textMessageIsVisible() {
    return !this.warningIsVisible
  }

  get checkFPSIsVisible() {
    return this.checkDeviceTimer ||
      this.checkDeviceDoneTimer
  }

  get infoIsVisible() {
    return this.progressType === ProgressType.CALCULATING &&
      !this.warningIsVisible
  }

  get chartIsVisible() {
    return this.processing &&
      this.signal.length &&
      this.faceDetected &&
      this.liveliness &&
      !this.checkDeviceTimer
  }

  get cameraSwitcherIsVisible() {
    return this.ready &&
      !this.processing
  }

  get faceNotificationIsVisible() {
    return this.processing &&
      this.faceDetected &&
      !this.checkDeviceTimer
  }

  get faceNotificationStep1IsVisible() {
    return !this.signal.length &&
      !this.progress
  }

  get faceNotificationStep2IsVisible() {
    return !this.signal.length &&
      this.progress
  }

  get faceNotificationStep3IsVisible() {
    return this.signal.length &&
      !this.threeValuesCalculated
  }

  get faceNotificationStep4IsVisible() {
    return this.signal.length &&
      this.threeValuesCalculated
  }

  get videoContainerIsVisible() {
    return !this.isCalculationEnded
  }

  get imageQualityIsVisible() {
    return this.processing &&
      !this.warningIsVisible
  }

  get loadingScreenIsVisible() {
    return !this.ready &&
      !this.errorInitializing
  }

  get warningMessage() {
    const warnings = this.translation['warnings']
    if (this.errorInitializing) {
      return warnings[WARNING_ERROR_LOADING]
    }
    if (!this.faceDetected) {
      return warnings[WARNING_NO_FACE_DETECTED]
    }
    if (!this.liveliness) {
      return warnings[WARNING_NO_LIVELINESS_DETECTED]
    }
    return ''
  }

  get notificationMessage() {
    return Object.values(this.notifications)[0]?.message || '' // todo sort
  }

  ngOnInit() {
    this.status = this.SIGNAL_STATUS.INITIALIZING
  }

  async ngAfterViewInit() {
    try {
      await this.initRPPG()
    } catch(e) {
      this.errorInitializing = true
    }
  }

  ngOnDestroy() {
    this.rppgInstance.stop()
    this.rppgInstance.closeCamera()
    this.checkDeviceTimer = null
    this.checkDeviceDoneTimer = null
  }

  async initRPPG() {
    this.rppgInstance = new RPPG({
      skipSocketWhenNoFace: true,
      onFrame: this.onFrameHandler.bind(this),
      onMeasurementMeanData: this.onMeasurementMeanDataHandler.bind(this),
      onMeasurementProgress: this.onMeasurementProgressHandler.bind(this),
      onSignalQuality: this.onSignalQualityHandler.bind(this),
      onMeasurementSignal: this.onMeasurementSignalHandler.bind(this),
      onInterferenceWarning: this.onInterferenceWarningHandler.bind(this),
    })

    await this.initCamera()
    await this.initTracker()
    this.ready = true
  }

  initCamera() {
    return this.rppgInstance.initCamera({
      width: this.width,
      height: this.height,
      videoElement: this.videoElement.nativeElement,
      useFrontCamera: this.useFrontCamera,
      onSuccess: (event: RPPGCameraInit) => {
        this.width = event.width
        this.height = event.height
      },
    })
  }

  initTracker(serverless = false) {
    return this.rppgInstance.initTracker({
      maxTimeBetweenBlinksSeconds: 20,
      serverless,
    })
  }

  initSocket() {
    return this.rppgInstance.initSocket({
      url: environment.SOCKET_URL,
      authToken: this.authToken,
      onConnect: () => {
        this.ready = true
      },
      onError: () => {
        this.ready = false
        this.errorInitializing = true
      },
      onClose: () => {
        this.ready = false
      },
    })
  }

  // RPPG Event onFrameHandler
  onFrameHandler(data: RPPGOnFrame) {
    this.faceDetected =
      data.rppgTrackerData.status !== 2 &&
      data.rppgTrackerData.status !== 1 // NO_FACE: 1, FACELOST: 2
    this.imageQualityFlags = data.rppgTrackerData.imageQualityFlags
    this.averageFps = data.averageFps
    this.maxFps = Math.max(data.instantFps, this.maxFps)

    if (this.useLiveliness) {
      this.liveliness = data.rppgTrackerData.eyeBlinkStatus
    }

    this.checkNotifications(data)
  }

  // RPPG Event onMeasurementMeanDataHandler
  onMeasurementMeanDataHandler(data: MeasurementMeanData) {
    this.bgrData = normalizeBGRData(data)
    this.isAllDataCalculated = isAllDataCalculated(this.bgrData)
    this.threeValuesCalculated = threeValuesCalculated(this.bgrData)
    if (this.isAllDataCalculated) {
      this.stopHandler()
      this.openResults()
    }
  }

  // RPPG Event onMeasurementProgressHandler
  onMeasurementProgressHandler({ progressPercent }: MeasurementProgress) {
    this.progress = progressPercent
  }

  // RPPG Event onSignalQualityHandler
  onSignalQualityHandler({snr}: SignalQuality) {
    if (snr < 2 && snr > -10) {
      this.status = this.SIGNAL_STATUS.WEAK_SIGNAL
    } else if (snr === -100) {
      this.status = this.SIGNAL_STATUS.INITIALIZING
    } else {
      this.status = this.SIGNAL_STATUS.MEASURING
    }
  }

  // RPPG Event onMeasurementSignalHandler
  onMeasurementSignalHandler({ signal }: MeasurementSignal) {
    if (this.processing) {
      this.signal = signal
    }
  }

  // RPPG Event onInterferenceWarningHandler
  onInterferenceWarningHandler() {
    this.interferenceWarning = true
    this.addNotification(NOTIFICATION_INTERFERENCE_WARNING)
    setTimeout(() => {
      this.interferenceWarning = false
      this.stopHandler()
      this.router.navigate(['/bad-conditions'])
    }, 3000)
  }

  async onStartButtonHandler(serverless = false) {
    if (!this.ready || this.isCalculationEnded) {
      return
    }

    // switch serverless without rppg instance reinitialisation
    this.rppgInstance.switchServerless(serverless)

    if (!serverless) {
      this.ready = false
      await this.initSocket() // establish socket connection in case we use server approach
    }

    this.ready = true
    if (this.rppgInstance.processing) {
      this.stopHandler()
    } else {
      this.startHandler()
    }
  }

  async stopHandler() {
    this.progressType = ProgressType.START
    this.rppgInstance.stop()
    this.processing = false
    this.interferenceWarning = false
    this.signal = []
    this.isCalculationEnded = true
    this.status = this.SIGNAL_STATUS.INITIALIZING
    clearTimeout(this.timeoutFunction)
    this.rppgInstance.closeCamera()
  }

  async startHandler() {
    this.clearNotifications()
    this.progressType = ProgressType.CALIBRATING
    this.averageFps = 0
    this.maxFps = 0
    this.status = this.SIGNAL_STATUS.INITIALIZING
    this.progress = 0
    this.bgrData = {
      bpm: 0,
      rr: 0,
      oxygen: 0,
      stressStatus: null,
      bloodPressureStatus: null,
    }
    this.signal = []
    this.interferenceWarning = false
    this.rppgInstance.start()
    this.processing = true
    this.isCalculationEnded = false
    this.threeValuesCalculated = false
    this.isAllDataCalculated = false
    this.startFPSCheckTimer()
    this.startTimeoutTimer()
  }

  startFPSCheckDoneTimer() {
    this.checkDeviceDoneTimer = setTimeout(() => {
      this.checkDeviceTimer = null
      this.checkDeviceDoneTimer = null
      this.progressType = ProgressType.CALCULATING
    }, FPS_CHECK_DONE_TIMEOUT)
  }

  startFPSCheckTimer() {
    this.checkDeviceTimer = setTimeout(() => {
      console.log('avgFPS:', this.averageFps, ', maxFPS:', this.maxFps, ', FPS threshold:', FPS_CHECK_THRESHOLD)
      if (this.maxFps < FPS_CHECK_THRESHOLD) {
        this.router.navigate(['/not-supported'])
        return
      }
      this.startFPSCheckDoneTimer()
    }, FPS_CHECK_TIMEOUT)
  }

  startTimeoutTimer() {
    this.timeoutFunction = setTimeout(() => {
      this.isCalculationEnded = true
      this.stopHandler()
      this.openResults()
    }, CALCULATION_TIMEOUT)
  }

  openResults() {
    this.router.navigate(['/results'], { state: {
      data: {
        bgrData: this.bgrData,
        lang: this.lang,
        isAllDataCalculated: this.isAllDataCalculated,
      },
    } })
  }

  addNotification(type: string) {
    if (this.notifications[type]?.timer) {
      clearTimeout(this.notifications[type].timer)
    }
    
    const timer = window.setTimeout(() => {
      delete this.notifications[type]
    }, NOTIFICATION_TIMEOUT)

    this.notifications[type] = {
      message: this.translation['notifications'][type] || '',
      type,
      timer,
    }
  }

  clearNotifications() {
    this.notifications = {}
  }

  checkNotifications(data: RPPGOnFrame) {
    if (!this.imageQualityFlags.faceOrientFlag) {
      this.addNotification(NOTIFICATION_FACE_ORIENT_WARNING)
    }
    if (!this.imageQualityFlags.faceSizeFlag) {
      this.addNotification(NOTIFICATION_FACE_SIZE_WARNING)
    }
    if (this.checkDeviceDoneTimer && data.averageFps < FPS_CHECK_THRESHOLD) {
      this.addNotification(NOTIFICATION_LOW_FPS_WARNING)
    }
  }
}
