import {
  FACEMESH_FACE_OVAL,
  FACEMESH_LEFT_EYE,
  FACEMESH_LEFT_EYEBROW,
  FACEMESH_LEFT_IRIS,
  FACEMESH_LIPS,
  FACEMESH_RIGHT_EYE,
  FACEMESH_RIGHT_EYEBROW,
  FACEMESH_RIGHT_IRIS,
  FACEMESH_TESSELATION,
} from '@mediapipe/face_mesh'

export const faceMeshLandmarkList = [
  FACEMESH_FACE_OVAL,
  FACEMESH_LEFT_EYE,
  FACEMESH_LEFT_EYEBROW,
  FACEMESH_LEFT_IRIS,
  FACEMESH_LIPS,
  FACEMESH_RIGHT_EYE,
  FACEMESH_RIGHT_EYEBROW,
  FACEMESH_RIGHT_IRIS,
  FACEMESH_TESSELATION,
]

export const faceMeshBaseUrl = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/'

export const faceMeshOptions = {
  maxNumFaces: 1,
  refineLandmarks: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
}

export const faceMeshLandmarkOptions = {
  color: '#FFFFFF20',
  lineWidth: 1,
}
