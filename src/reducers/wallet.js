import {
  CONNECT_WALLET,
} from '../types'

export function wallet(state = { loaded: false }, action = {}) {
  switch(action.type) {
    case CONNECT_WALLET:
      return {
        ...action.wallet,
        loaded: true,
      }
    default:
      return state
  }
}

