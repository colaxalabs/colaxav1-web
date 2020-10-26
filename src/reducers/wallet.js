import {
  CONNECT_WALLET,
  WALLET_FOUND,
  WALLET_DISCONNECT,
} from '../types'

export function wallet(state = { loaded: false, isMetamask: false }, action = {}) {
  switch(action.type) {
    case CONNECT_WALLET:
      return {
        ...action.wallet,
        loaded: true,
      }
    case WALLET_FOUND:
      return {
        ...state,
        isMetamask: action.wallet.isMetamask,
      }
    case WALLET_DISCONNECT:
      return {
        loaded: false,
      }
    default:
      return state
  }
}

