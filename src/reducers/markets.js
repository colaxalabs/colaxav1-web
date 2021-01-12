import {
  LOAD_MARKETS,
  LISTEN_BOOK,
  LISTEN_MARKETING,
  LISTEN_MARKET_CONFIRMATION,
} from '../types'

const INITIAL_STATE = {
  traces: 0,
  totalMarkets: 0,
  txs: '0',
  enlistedMarkets: [],
}

export function markets(state = INITIAL_STATE, action = {}) {
  switch(action.type) {
    case LOAD_MARKETS:
      return {
        ...action.marketsData,
      }
    case LISTEN_BOOK:
      return {
        ...state,
        enlistedMarkets: [...state.enlistedMarkets].map(market =>
        (Number(market.tokenId) === Number(action.resp.id))
          ? { ...market, remainingSupply: action.resp.volume, bookers: action.resp.bookers, closeDate: action.resp.closeDate }
          : market)
      }
    case LISTEN_MARKETING:
      return {
        ...state,
        totalMarkets: action.totals,
      }
    case LISTEN_MARKET_CONFIRMATION:
      return {
        ...state,
        txs: action.txs,
      }
    default:
      return state
  }
}
