import {
  LOAD_MARKETS,
} from '../types'

export function markets(state = [], action = {}) {
  switch(action.type) {
    case LOAD_MARKETS:
      return [
        ...action.markets,
      ]
    default:
      return state
  }
}
