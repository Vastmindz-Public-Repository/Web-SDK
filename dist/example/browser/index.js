/* global rppg */

async function initRPPG(serverless) {
  // const backendUrl = 'https://rppg-dev2.xyz/v1/account/api/public/login'
  const videoElement = document.querySelector('.video')
  const canvasElement = document.querySelector('.canvas')
  const canvasChartElement = document.querySelector('.chart')
  const canvasChartCtx = canvasChartElement.getContext('2d')

  canvasChartElement.width = 720
  canvasChartElement.height = 600
  canvasChartCtx.lineWidth = 1
  // canvasChartCtx.imageSmoothingEnabled = true

  // const tokenInput = document.querySelector('.token')
  // const emailInput = document.querySelector('.email')
  // const passwordInput = document.querySelector('.password')
  // const loginButton = document.querySelector('.loginButton')

  const calcData = {
    frameData: {
      rppgTrackerData: {
        status: -1,
        bgr1d: [],
        landmarks: [],
        face: [],
        eyeBlinkStatus: false,
        imageQualityFlags: [],
      },
      instantFps: -1,
      averageFps: -1,
      timestamp: -1,
    },
    measurementProgress: 0,
    measurementMeanData: {
      bloodPressureStatus: '-1',
      bpm: -1,
      oxygen: -1,
      rr: -1,
      stressStatus: '-1',
    },
    measurementSignal: {
      signal: [],
      ecg: [],
    },
    stressIndex: -1,
    hrvMetrics: {
      ibi: -1,
      rmssd: -1,
      sdnn: -1,
    },
    singalQuality: {
      snr: 0,
    },
    measurementStatus: {
      statusCode: '',
      statusMessage: '',
    },
    bloodPressure: {
      systolic: -1,
      diastolic: -1,
    },
  }

  const rppgInstance = window.rppgInstance = new rppg({
    serverless,
    onFrame: (data) => {
      // console.log('onFrame', data)
      calcData.frameData = data
      
      render(calcData)
      console.log('onFrame', calcData)
    },

    onMeasurementProgress: (data) => {
      // console.log('onMeasurementProgress', data.progressPercent)
      calcData.measurementProgress = data.progressPercent
    },
    onMeasurementMeanData: (data) => {
      // console.log('onMeasurementMeanData', data)
      calcData.measurementMeanData = data
    },
    onMeasurementSignal: (data) => {
      // console.log('onMeasurementSignal', data.signal)
      calcData.measurementSignal = data
    },
    onStressIndex: (data) => {
      // console.log('onStressIndex:', data)
      calcData.stressIndex = data.stress
    },
    onHrvMetrics: (data) => {
      // console.log('onHrvMetrics:', data)
      calcData.hrvMetrics = data
    },
    onSignalQuality: (data) => {
      // console.log('onSignalQuality:', data)
      calcData.singalQuality = data
    },
    onMeasurementStatus: (data) => {
      // console.log('onMeasurementStatus:', data)
      calcData.measurementStatus = data
    },
    // todo | not implemented
    onBloodPressure: (data) => {
      // console.log('onBloodPressure:', data)
      calcData.bloodPressure = data
    },
    onInterferenceWarning: (data) => {
      console.log('onInterferenceWarning:', data)
    },
    onUnstableConditionsWarning: (data) => {
      console.log('onUnstableConditionsWarning:', data)
    },
  })

  await rppgInstance.initCamera({
    width: 640,
    height: 480,
    videoElement: videoElement,
    canvasElement: canvasElement,
    useFrontCamera: false,
  })

  await rppgInstance.initTracker({
    pathToWasmData: 'http://localhost:8080/',
  })

  // loginButton.addEventListener('click', async () => {
  //   try {
  //     const response = await fetch(backendUrl, {
  //       method: 'POST',
  //       mode: 'cors',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         email: emailInput.value,
  //         password: passwordInput.value,
  //       }),
  //     })
  //     const { data } = await response.json()
  //     tokenInput.value = data.authToken
  //     startButton.removeAttribute('disabled')
  //   } catch (e) {
  //     startButton.setAttribute('disabled', true)
  //   }
  // })

  startButton.addEventListener('click', async () => {
    if (!serverless && !rppgInstance.rppgSocket) {
      await this.rppgInstance.initSocket({
        url: 'wss://airasia-dev.xyz/vp/bgr_signal_socket',
        // authToken: tokenInput.value,
        onConnect: () => console.log('Socket connection established'),
        onClose: (event) => console.log('Socket connection closed', event),
        onError: (event) => console.log('Socket connection error', event),
      })
    }
    if (rppgInstance.processing) {
      rppgInstance.stop()
      startButton.innerText = 'Start'
      switchCamera.removeAttribute('disabled')
    } else {
      rppgInstance.start()
      startButton.innerText = 'Stop'
      switchCamera.setAttribute('disabled', true)
    }
  })

  switchCamera.addEventListener('click', () => {
    const useFrontCamera = rppgInstance.rppgCamera.useFrontCamera
    rppgInstance.rppgCamera.switchCamera(!useFrontCamera)
  })

  function drawChart({
    signal = [],
    startX = 0,
    startY = 0,
    color = 'red',
  }) {
    canvasChartCtx.beginPath()
    let px2 = startX
    let py2 = canvasChartElement.height / 2 / 4 + startY
    canvasChartCtx.strokeStyle = color
    signal.forEach((y, x) => {
      if (!canvasChartCtx) {
        return
      }
      canvasChartCtx.moveTo(px2, py2)
      canvasChartCtx.lineTo(x + startX, y + startY)
      px2 = x + startX
      py2 = y + startY
    })
    canvasChartCtx.stroke()
  }

  function render({
    measurementProgress,
    frameData,
    measurementMeanData,
    bloodPressure,
    stressIndex,
    hrvMetrics,
    measurementStatus,
    measurementSignal,
    singalQuality,
  }) {
    const fields = [
      { name: 'serverless', value: serverless },
      { name: 'progress', value: measurementProgress },
      { name: 'instantFps', value: frameData.instantFps },
      { name: 'averageFps', value: frameData.averageFps },
      { name: 'bpm', value: measurementMeanData.bpm },
      { name: 'rr', value: measurementMeanData.rr },
      { name: 'oxygen', value: measurementMeanData.oxygen },
      { name: 'bloodPressureStatus', value: measurementMeanData.bloodPressureStatus },
      { name: 'systolic', value: bloodPressure.systolic },
      { name: 'diastolic', value: bloodPressure.diastolic },
      { name: 'stressIndex', value: stressIndex },
      { name: 'stressStatus', value: measurementMeanData.stressStatus },
      { name: 'hrv.ibi', value: hrvMetrics.ibi },
      { name: 'hrv.rmssd', value: hrvMetrics.rmssd },
      { name: 'hrv.sdnn', value: hrvMetrics.sdnn },
      { name: 'eyeBlinkStatus', value: frameData.rppgTrackerData.eyeBlinkStatus },
      { name: 'brightColorFlag', value: frameData.rppgTrackerData.imageQualityFlags.brightColorFlag },
      { name: 'faceOrientFlag', value: frameData.rppgTrackerData.imageQualityFlags.faceOrientFlag },
      { name: 'faceSizeFlag', value: frameData.rppgTrackerData.imageQualityFlags.faceSizeFlag },
      { name: 'illumChangeFlag', value: frameData.rppgTrackerData.imageQualityFlags.illumChangeFlag },
      { name: 'noiseFlag', value: frameData.rppgTrackerData.imageQualityFlags.noiseFlag },
      { name: 'sharpFlag', value: frameData.rppgTrackerData.imageQualityFlags.sharpFlag },
      { name: 'status', value: frameData.rppgTrackerData.status },
      { name: 'statusCode', value: measurementStatus.statusCode },
      { name: 'statusMessage', value: measurementStatus.statusMessage },
      { name: 'singalQuality', value: singalQuality.snr },
    ]

    canvasChartCtx.beginPath()
    canvasChartCtx.clearRect(0, 0, canvasChartElement.width, canvasChartElement.height)

    drawChart({
      signal: measurementSignal.signal,
      startY: 0,
      color: 'red',
    })
    drawChart({
      signal: measurementSignal.ecg,
      startY: 200,
      color: 'green',
    })

    canvasChartCtx.strokeStyle = 'black'
    canvasChartCtx.font = '14px Arial'
    fields.forEach(({name, value}, idx) =>
      canvasChartCtx.strokeText(`${name}: ${value}`, 400, idx * 20 + 20))
  }
}

const startButtonWSocket = document.querySelector('.startButton-w-socket')
const startButtonWOSocket = document.querySelector('.startButton-wo-socket')
const startButton = document.querySelector('.startButton')
const switchCamera = document.querySelector('.switchCamera')

function init() {
  startButtonWSocket.addEventListener('click', async () => {
    startButton.removeAttribute('disabled')
    switchCamera.removeAttribute('disabled')
    startButtonWSocket.setAttribute('disabled', true)
    startButtonWOSocket.setAttribute('disabled', true)
    initRPPG(false)
  })
  startButtonWOSocket.addEventListener('click', async () => {
    startButton.removeAttribute('disabled')
    switchCamera.removeAttribute('disabled')
    startButtonWSocket.setAttribute('disabled', true)
    startButtonWOSocket.setAttribute('disabled', true)
    initRPPG(true)
  })
}



init()