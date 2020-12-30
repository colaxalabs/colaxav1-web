import {
  LOAD_MARKETS,
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

