import {
  CONNECT_WALLET,
  WALLET_FOUND,
  WALLET_DISCONNECT,
  LOCATION_ACCESS,
  WALLET_CHANGE,
} from '../types'

const INITIAL_STATE = {
  loaded: false,
  isMetamask: false,
  address: [],
  longitude: '0.0',
  latitude: '0.0'
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
        ...state,
        address: [],
        loaded: false,
      }
    case LOCATION_ACCESS:
      return {
        ...state,
        ...action.coords,
      }
    case WALLET_CHANGE:
      return {
        ...state,
        address: action.wallet.address,
      }
    default:
      return state
  }
}

