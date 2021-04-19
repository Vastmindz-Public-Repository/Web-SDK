/* global rppg */

async function init() {
  const backendUrl = 'https://rppg-dev2.xyz/v1/account/api/public/login'
  const videoElement = document.querySelector('.video')
  const canvasElement = document.querySelector('.canvas')
  const tokenInput = document.querySelector('.token')
  const emailInput = document.querySelector('.email')
  const passwordInput = document.querySelector('.password')
  const startButton = document.querySelector('.startButton')
  const loginButton = document.querySelector('.loginButton')

  const rppgInstance = window.rppgInstance = new rppg({
    onFrame: (data) => console.log('onFrame', data),
    onMeasurementProgress: (data) => console.log('onMeasurementProgress', data),
    onMeasurementMeanData: (data) => console.log('onMeasurementMeanData', data),
  })

  await rppgInstance.initCamera({
    width: 640,
    height: 480,
    videoElement: videoElement,
    canvasElement: canvasElement,
  })

  await rppgInstance.initTracker({
    pathToWasmData: 'https://websdk1.blob.core.windows.net/sdk/',
  })

  loginButton.addEventListener('click', async () => {
    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailInput.value,
          password: passwordInput.value,
        }),
      })
      const { data } = await response.json()
      tokenInput.value = data.authToken
      startButton.removeAttribute('disabled')
    } catch (e) {
      startButton.addAttribute('disabled')
    }
  })

  startButton.addEventListener('click', async () => {
    if (!rppgInstance.rppgSocket) {
      await this.rppgInstance.initSocket({
        url: 'wss://rppg-dev2.xyz/vp/bgr_signal_socket',
        authToken: tokenInput.value,
        onConnect: () => console.log('Socket connection established'),
        onClose: (event) => console.log('Socket connection closed', event),
        onError: (event) => console.log('Socket connection error', event),
      })
    }
    if (rppgInstance.processing) {
      rppgInstance.stop()
      startButton.innerText = 'Start'
    } else {
      rppgInstance.start()
      startButton.innerText = 'Stop'
    }
  })
}

init()