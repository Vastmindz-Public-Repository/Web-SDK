import { CSSProperties } from 'react'

export const loadingScreenMessages = [
  'We\'re loading an awesome module onto your device...',
  'Using this, your web browser will turn into a remote monitoring tool...',
  'Using AI, we will be able to understand your physiology...',
  'Please wait. This won\'t take long...',
]

export const loadingScreenDelay = 8000

export const spinnerCssOverride: CSSProperties = {
  borderWidth: '4px',
  borderColor: 'rgba(255, 255, 255, 0.7) rgba(255, 255, 255, 0.7) rgba(255, 255, 255, 0.063)',
}

export const spinnerSpeedMultiplier = 0.75

export const spinnerSize = 64

