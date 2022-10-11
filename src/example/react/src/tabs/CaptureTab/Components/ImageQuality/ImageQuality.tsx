import { useEffect, useState } from 'react'
import { ImageQualityFlags } from 'rppg/dist/lib/RPPGTracker.types'
import './ImageQuality.scss'

type Props = {
  imageQualityFlags: ImageQualityFlags
}

export const ImageQuality: React.FC<Props> = ({imageQualityFlags}) => {
  const [imageQuality, setImageQuality] = useState<boolean[]>([])

  useEffect(() => {
    const {
      brightColorFlag,
      illumChangeFlag,
      noiseFlag,
      sharpFlag,
    } = imageQualityFlags

    const value = Object.values({
      brightColorFlag,
      illumChangeFlag,
      noiseFlag,
      sharpFlag,
    }).sort((a, b) => +b - +a)

    setImageQuality(value)
  }, [imageQualityFlags])

  return (
    <div className="image-quality-container">
      {imageQuality.map((value, key) =>
        <svg
          key={key}
          className={`image-quality ${value ? 'active' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          width="255"
          height="240"
          viewBox="0 0 51 48">
          <path fill="currentColor" stroke="#000" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
        </svg>
      )}
    </div>
  )
}
