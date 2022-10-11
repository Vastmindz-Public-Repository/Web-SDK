// todo discover why serverless switching doesn't work

import {
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import {
  CALCULATION_TIMEOUT,
  FPS_CHECK_DONE_TIMEOUT,
  FPS_CHECK_THRESHOLD,
  FPS_CHECK_TIMEOUT,
} from 'helpers/capture'
import RPPG from 'rppg/dist'
import {
  checkIsAllDataCalculated,
  defaultFpsValue,
  defaultImageQualityFlags,
  defaultRppgData,
  Fps,
  normalizeBGRData,
  normalizeHRVData,
  RPPGData,
  UseRPPG,
  UseRPPGResult,
} from 'helpers/rppg'
import { RPPGOnFrame } from 'rppg/dist/lib/RPPG.types'
import {
  HrvMetrics,
  MeasurementMeanData,
  MeasurementProgress,
  MeasurementSignal,
  MeasurementStatus,
  SignalQuality,
} from 'rppg/dist/lib/RPPGEvents.types'
import { ProgressType } from 'tabs/CaptureTab/Components'

export interface CameraConfig {
  width: number
  height: number
}

function useRPPG({
  videoElement,
  serverless = true,
  useFrontCamera = true,
  authToken = '',
  onUnsupportedDeviceCb,
  onAllDataCalculatedCb,
  onCalculationEndedCb,
  onInterferenceWarningCb,
  onUnstableConditionsWarningCb,
  onFaceOrientWarningCb,
  onFaceSizeWarningCb,
}: UseRPPG): UseRPPGResult {
  const [rppgData, setRppgData] = useReducer((
    state: RPPGData,
    updates: Partial<RPPGData>
  ) => ({ ...state, ...updates }),
    defaultRppgData
  )
  const [ready, setReady] = useState<boolean>(false)
  const [rppgInstance, setRppgInstance] = useState<RPPG>()
  const [isAllDataCalculated, setIsAllDataCalculated] = useState(false)
  const [isCalculationEnded, setIsCalculationEnded] = useState(false)
  const [fps, setFps] = useState<Fps>(defaultFpsValue)
  const [imageQualityFlags, setImageQualityFlags] = useState(defaultImageQualityFlags)
  const [progressType, setProgressType] = useState(ProgressType.START)
  const [processing, setProcessing] = useState(false)
  const checkDeviceDoneTimer = useRef<NodeJS.Timeout>()
  const checkDeviceTimer = useRef<NodeJS.Timeout>()
  const timeoutTimer = useRef<NodeJS.Timeout>()
  const onInterferenceWarningCbRef = useRef<(() => void) | undefined>()
  const onUnstableConditionsWarningCbRef = useRef<(() => void) | undefined>()
  const onFaceOrientWarningCbRef = useRef<(() => void) | undefined>()
  const onFaceSizeWarningCbRef = useRef<(() => void) | undefined>()

  useEffect(() => {
    let isMounted = true
    async function initRPPG() {
      if (!videoElement.current) {
        return
      }

      const onFrame = (frameData: RPPGOnFrame) => {
        if (!isMounted) {
          return
        }
        setFps((fps) => ({
          ...fps,
          maxFps: Math.max(frameData.instantFps, fps.maxFps),
          instantFps: frameData.instantFps,
          averageFps: frameData.averageFps,
        }))
        setImageQualityFlags(frameData.rppgTrackerData.imageQualityFlags)
        setRppgData({ frameData })
      }

      const onMeasurementMeanData = (measurementData: MeasurementMeanData) =>
        isMounted && setRppgData({ measurementData: normalizeBGRData(measurementData) })

      const onMeasurementStatus = (measurementStatus: MeasurementStatus) =>
        isMounted && setRppgData({ measurementStatus })

      const onMeasurementProgress = (measurementProgress: MeasurementProgress) =>
        isMounted && setRppgData({ measurementProgress })

      const onSignalQuality = (signalQuality: SignalQuality) =>
        isMounted && setRppgData({ signalQuality })

      const onMeasurementSignal = (measurementSignal: MeasurementSignal) =>
        isMounted && setRppgData({ measurementSignal })

      const onHrvMetrics = (hrvMetrics: HrvMetrics) =>
        isMounted && setRppgData({ hrvMetrics: normalizeHRVData(hrvMetrics) })

      const onInterferenceWarning = () =>
        isMounted &&
        typeof onInterferenceWarningCbRef.current === 'function' &&
        onInterferenceWarningCbRef.current()

      const onUnstableConditionsWarning = () =>
        isMounted &&
        typeof onUnstableConditionsWarningCbRef.current === 'function' &&
        onUnstableConditionsWarningCbRef.current()

      const onFaceOrientWarning = () =>
        isMounted &&
        typeof onFaceOrientWarningCbRef.current === 'function' &&
        onFaceOrientWarningCbRef.current()

      const onFaceSizeWarning = () =>
        isMounted &&
        typeof onFaceOrientWarningCbRef.current === 'function' &&
        onFaceOrientWarningCbRef.current()

      const rppg = new RPPG({
        serverless,

        // camera config
        rppgCameraConfig: {
          useFrontCamera,
          videoElement: videoElement.current,
        },

        // tracker config
        rppgTrackerConfig: {
          maxTimeBetweenBlinksSeconds: 20,
        },

        // socker config
        rppgSocketConfig: {
          authToken,
        },
  
        onFrame,
        onMeasurementMeanData,
        onMeasurementStatus,
        onMeasurementProgress,
        onSignalQuality,
        onMeasurementSignal,
        onHrvMetrics,
        onInterferenceWarning,
        onUnstableConditionsWarning,
        onFaceOrientWarning,
        onFaceSizeWarning,
      })

      setRppgInstance(rppg)

      await rppg.init()

      setReady(true)
    }

    initRPPG()

    return () => {
      isMounted = false
    }
    
  }, [videoElement, serverless, authToken, useFrontCamera])

  useEffect(() => {
    const {
      isAllDataCalculated,
    } = checkIsAllDataCalculated(rppgData.measurementData)
    setIsAllDataCalculated(isAllDataCalculated)
  }, [rppgData.measurementData])

  const start = () => {
    if (!rppgInstance) {
      console.error('Not initialized')
      return
    }
    setRppgData(defaultRppgData)
    setProgressType(ProgressType.CALIBRATING)
    setProcessing(true)
    setIsCalculationEnded(false)
    rppgInstance.start()
    startFPSCheckTimer()
    startTimeoutTimer()
  }

  const stop = () => {
    if (!rppgInstance) {
      console.error('Not initialized')
      return
    }
    setProgressType(ProgressType.START)
    setProcessing(false)
    clearTimeout(checkDeviceDoneTimer.current)
    checkDeviceDoneTimer.current = undefined
    clearTimeout(checkDeviceTimer.current)
    checkDeviceTimer.current = undefined
    clearTimeout(timeoutTimer.current)
    timeoutTimer.current = undefined
    rppgInstance.stop()
  }

  const closeCamera = () => rppgInstance?.closeCamera()

  const switchServerless = (serverless: boolean) =>
    rppgInstance?.switchServerless(serverless)

  const switchCamera = (useFrontCamera: boolean) =>
    rppgInstance?.switchCamera(useFrontCamera) || Promise.resolve(undefined)

  // Timers
  const startFPSCheckDoneTimer = () => {
    checkDeviceDoneTimer.current = setTimeout(() => {
      checkDeviceTimer.current = undefined
      checkDeviceDoneTimer.current = undefined
      setProgressType(ProgressType.CALCULATING)
    }, FPS_CHECK_DONE_TIMEOUT)
  }

  const startFPSCheckTimer = () =>
    checkDeviceTimer.current = setTimeout(() => {
      setFps((fps) => ({
        ...fps,
        unsupported: fps.maxFps < FPS_CHECK_THRESHOLD,
      }))
      startFPSCheckDoneTimer()
    }, FPS_CHECK_TIMEOUT)

  const startTimeoutTimer = () =>
    timeoutTimer.current = setTimeout(() => {
      setIsCalculationEnded(true)
      console.log('Stop - Timeout')
    }, CALCULATION_TIMEOUT)

  // callback events
  // onUnsupportedDeviceCb event
  useEffect(() => {
    if (fps.unsupported && typeof onUnsupportedDeviceCb === 'function') {
      onUnsupportedDeviceCb()
    }
  }, [fps.unsupported, onUnsupportedDeviceCb])

  // onAllDataCalculatedCb event
  useEffect(() => {
    if (isAllDataCalculated && typeof onAllDataCalculatedCb === 'function') {
      onAllDataCalculatedCb()
    }
  }, [isAllDataCalculated, onAllDataCalculatedCb])

  // onCalculationEndedCb event
  useEffect(() => {
    if (isCalculationEnded && typeof onCalculationEndedCb === 'function') {
      onCalculationEndedCb()
    }
  }, [isCalculationEnded, onCalculationEndedCb])

  // onInterferenceWarningCb Event
  useEffect(() => {
    onInterferenceWarningCbRef.current = onInterferenceWarningCb
  }, [onInterferenceWarningCb])

  // onUnstableConditionsWarning event
  useEffect(() => {
    onUnstableConditionsWarningCbRef.current = onUnstableConditionsWarningCb
  }, [onUnstableConditionsWarningCb])

  // onFaceOrientWarningCb event
  useEffect(() => {
    onFaceOrientWarningCbRef.current = onFaceOrientWarningCb
  }, [onFaceOrientWarningCb])

  // onFaceSizeWarningCb event
  useEffect(() => {
    onFaceSizeWarningCbRef.current = onFaceSizeWarningCb
  }, [onFaceSizeWarningCb])

  return {
    rppgData,
    ready,
    rppgInstance,
    isAllDataCalculated,
    fps,
    imageQualityFlags,
    progressType,
    processing,
    checkFps: Boolean(checkDeviceDoneTimer.current || checkDeviceTimer.current),
    start,
    stop,
    closeCamera,
    switchServerless,
    switchCamera,
  }
}

export default useRPPG
