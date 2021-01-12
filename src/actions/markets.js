import {
  LOAD_MARKETS,
  LISTEN_BOOK,
  MARKET_DASH_LOADING,
  LISTEN_MARKETING,
  LISTEN_MARKET_CONFIRMATION,
  LISTEN_REVIEWING,
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

export const listenMarketing = totals => ({
  type: LISTEN_MARKETING,
  totals,
})

export const listenMarketConfirmation = txs => ({
  type: LISTEN_MARKET_CONFIRMATION,
  txs,
})

export const listenReviewing = resp => ({
  type: LISTEN_REVIEWING,
  resp,
})

