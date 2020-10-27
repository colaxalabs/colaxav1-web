import {
  LOAD_CONVERSION_RATE,
} from '../types'

const INITIAL_STATE = { ethusd: 0 }

export function currency(state = INITIAL_STATE, action = {}) {
  switch(action.type) {
    case LOAD_CONVERSION_RATE:
      return {
        ...action.currency,
      }
    default:
      return state
  }
}

