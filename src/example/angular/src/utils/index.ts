import { BloodPressureStatus, MeasurementMeanData } from "rppg/dist/lib/RPPGEvents.types"
import { BPS, NO_DATA } from "src/consts"

export const convertBPS = (data: BloodPressureStatus) => BPS[data] || data

export const isAllDataCalculated = (data: MeasurementMeanData) => {
  const {
    bpm,
    rr,
    oxygen,
    stressStatus,
    bloodPressureStatus,
  } = data
  return Boolean(bpm && rr && oxygen && stressStatus && bloodPressureStatus)
}

export const threeValuesCalculated = (data: MeasurementMeanData) => {
  const {
    bpm,
    rr,
    oxygen,
    stressStatus,
    bloodPressureStatus,
  } = data
  return [bpm, rr, oxygen, stressStatus, bloodPressureStatus].filter(item => item).length >= 3
}

export const normalizeBGRData = (bgrData: MeasurementMeanData): MeasurementMeanData => {
  const {
    stressStatus,
    bloodPressureStatus,
  } = bgrData
  return {
    ...bgrData,
    stressStatus: (stressStatus === null || String(stressStatus) === NO_DATA) ? null : stressStatus,
    bloodPressureStatus: bloodPressureStatus === null || String(bloodPressureStatus) === NO_DATA ? null : convertBPS(bloodPressureStatus),
  }
}