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
        ...state,
        traces: action.marketsData.traces,
        totalMarkets: action.marketsData.totalMarkets,
        txs: action.marketsData.txs,
        enlistedMarkets: [...action.marketsData.enlistedMarkets].filter(item => item !== null),
      }
    default:
      return state
  }
}
