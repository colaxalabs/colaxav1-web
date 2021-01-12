import {
  LOAD_DASHBOARD,
  DASHBOARD_LOADING,
  USER_DASH_LOADING,
  FARM_DASH_LOADING,
  LISTEN_FOR_TOKENIZE,
  LISTEN_FOR_CREATE_MARKET,
  LISTEN_FOR_VOLUME,
  LISTEN_TRANSITION,
} from '../types'

export const loadDashboard = dashboardData => ({
  type: LOAD_DASHBOARD,
  dashboardData,
})

export const isDashLoading = loading => ({
  type: DASHBOARD_LOADING,
  loading,
})

export const isUserDashLoading = loading => ({
  type: USER_DASH_LOADING,
  loading,
})

export const isFarmDashLoading = loading => ({
  type: FARM_DASH_LOADING,
  loading,
})

export const listenTokenize = lands => ({
  type: LISTEN_FOR_TOKENIZE,
  lands,
})

export const listenVolume = txs => ({
  type: LISTEN_FOR_VOLUME,
  txs,
})

export const listenCreateMarket = markets => ({
  type: LISTEN_FOR_CREATE_MARKET,
  markets,
})

export const listenTransition = resp => ({
  type: LISTEN_TRANSITION,
  resp,
})

