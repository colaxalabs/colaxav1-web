import {
  LOAD_DASHBOARD,
  DASHBOARD_LOADING,
  USER_DASH_LOADING,
  FARM_DASH_LOADING,
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

