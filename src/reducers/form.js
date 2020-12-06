import {
  COLLECT_DETAILS,
  COLLECT_MEASUREMENTS,
  COLLECT_FARM_IMAGE,
  COLLECT_LOCATION
} from '../types'

const INITIAL_STATE = {
  farmName: '',
  farmLocation: '',
  farmSize: '',
  sizeUnit: '',
  soilType: '',
  farmImage: '',
}

export function form(state = INITIAL_STATE, action={}) {
  switch(action.type) {
    case COLLECT_DETAILS:
      return {
        ...state,
        ...action.details,
      }
    case COLLECT_MEASUREMENTS:
      return {
        ...state,
        farmSize: action.measurements.farmSize,
        sizeUnit: action.measurements.sizeUnit,
        soilType: action.measurements.soilType,
      }
    case COLLECT_FARM_IMAGE:
      return {
        ...state,
        farmImage: action.buffer,
      }
    case COLLECT_LOCATION:
      return {
        ...state,
        farmLocation: action.location,
      }
    default:
      return state
  }
}
