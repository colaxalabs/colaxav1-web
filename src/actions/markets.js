import {
  LOAD_MARKETS,
  LISTEN_BOOK,
  MARKET_DASH_LOADING,
} from '../types'

export const loadMarkets = marketsData => ({
  type: LOAD_MARKETS,
  marketsData,
})

export const loadMarketDash = status => ({
  type: MARKET_DASH_LOADING,
  status,
})

export const listenBook = resp => ({
  type: LISTEN_BOOK,
  resp,
})

