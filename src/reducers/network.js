import {
  LOAD_NETWORK,
  NETWORK_CHANGE,
} from '../types'

export function network(state = {}, action = {}) {
  switch(action.type) {
    case LOAD_NETWORK:
      return {
        ...action.net,
      }
    case NETWORK_CHANGE:
      return {
        ...state,
        ...action.net,
      }
    default:
      return state
  }
}

