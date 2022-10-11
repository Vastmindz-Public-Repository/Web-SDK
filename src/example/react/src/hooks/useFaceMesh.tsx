import {
  useCallback,
  useEffect,
  useState,
  MutableRefObject,
  RefObject,
  useRef,
} from 'react'

import {
  drawConnectors,
} from '@mediapipe/drawing_utils'

import {
  FaceMesh,
  Results,
} from '@mediapipe/face_mesh'

import {
  Camera,
} from '@mediapipe/camera_utils'

import {
  faceMeshBaseUrl,
  faceMeshLandmarkList,
  faceMeshLandmarkOptions,
  faceMeshOptions,
} from 'helpers/facemesh'

export interface UseFaceMesh {
  videoElement: RefObject<HTMLVideoElement>
  canvasElement: RefObject<HTMLCanvasElement>
  processing: MutableRefObject<boolean>
  onFaceDetectionChange?: (faceDetected: boolean) => void
}

export interface UseFaceMeshResult {
  faceMeshReady: boolean
  faceDetected: boolean
  faceMeshInstance: FaceMesh | void | number
  cameraInstance: Camera | void
}

function useFaceMesh({
  videoElement,
  canvasElement,
  processing,
  onFaceDetectionChange,
}: UseFaceMesh): UseFaceMeshResult {
  const [ready, setReady] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)
  const [faceMeshInstance, setFaceMeshInstance] = useState<FaceMesh | void>(undefined)
  const [cameraInstance, setCameraInstance] = useState<Camera | void>(undefined)

  const faceMeshOnResults = useCallback((results: Results) => {
    setFaceDetected(!!results.multiFaceLandmarks.length)
    
    const canvasElementCtx = canvasElement.current?.getContext('2d')

    if (!canvasElement.current || !videoElement.current || !canvasElementCtx) {
      return
    }

    canvasElement.current.width = videoElement.current.videoWidth
    canvasElement.current.height = videoElement.current.videoHeight

    canvasElementCtx.save()
    canvasElementCtx.clearRect(0, 0, canvasElement.current.width, canvasElement.current.height)
    // canvasElementCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height)

    if (results.multiFaceLandmarks && processing.current) {
      for (const landmarks of results.multiFaceLandmarks) {
        faceMeshLandmarkList.forEach(item =>
          drawConnectors(canvasElementCtx, landmarks, item, faceMeshLandmarkOptions))
      }
    }

    canvasElementCtx.restore()
  }, [canvasElement, videoElement, processing])

  useEffect(() => {
    const faceMeshInit = () => {
      if(!videoElement.current || faceMeshInstance) {
        return
      }

      const faceMesh = new FaceMesh({
        locateFile: (file) => faceMeshBaseUrl + file,
      })
  
      faceMesh.setOptions(faceMeshOptions)
      faceMesh.onResults(faceMeshOnResults)
      setFaceMeshInstance(faceMesh)
      // await faceMesh.initialize()
      setReady(true)

      const camera = new Camera(videoElement.current, {
        onFrame: () =>
          videoElement.current
            ? faceMesh.send({ image: videoElement.current })
            : Promise.resolve(),
      })
      setCameraInstance(camera)
      camera.start()
    }

    faceMeshInit()

  }, [videoElement, faceMeshOnResults, faceMeshInstance])

  // callback events
  const onFaceDetectionChangeRef = useRef<((faceDetected: boolean) => void) | undefined>()

  useEffect(() => {
    onFaceDetectionChangeRef.current = onFaceDetectionChange
  }, [onFaceDetectionChange])

  useEffect(() => {
    if (typeof onFaceDetectionChangeRef.current === 'function') {
      onFaceDetectionChangeRef.current(faceDetected)
    }
  }, [faceDetected])

  return {
    faceMeshReady: ready,
    faceDetected,
    faceMeshInstance,
    cameraInstance,
  }
}

export default useFaceMesh
