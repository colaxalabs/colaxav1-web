import {
  LOAD_MARKETS,
} from '../types'

const INITIAL_STATE = {
  traces: 0,
  totalMarkets: 0,
  txs: 0,
  enlistedMarkets: [],
}

export function markets(state = INITIAL_STATE, action = {}) {
  switch(action.type) {
    case LOAD_MARKETS:
      return {
        ...action.marketsData,
      }
    default:
      return state
  }
}
