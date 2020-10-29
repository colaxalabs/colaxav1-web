import {
  CONNECT_WALLET,
  WALLET_FOUND,
  WALLET_DISCONNECT,
} from '../types'

const INITIAL_STATE = {
  loaded: false,
  isMetamask: false,
  address: [],
}

export function wallet(state = INITIAL_STATE, action = {}) {
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

