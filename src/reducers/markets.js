import {
  LOAD_MARKETS,
  BOOKED,
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
    case BOOKED:
      return {
        ...state,
        enlistedMarkets: [...state.enlistedMarkets].map(market =>
        (Number(market.tokenId) === Number(action.resp.id))
          ? { ...market, bookers: action.resp.bookers, remainingSupply: Number(market.remainingSupply) - Number(action.resp.volume) }
          : market
        )
      }
    default:
      return state
  }
}
