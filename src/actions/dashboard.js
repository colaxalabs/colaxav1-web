import {
  LOAD_DASHBOARD,
  DASHBOARD_LOADING,
} from '../types'

export const loadDashboard = dashboardData => ({
  type: LOAD_DASHBOARD,
  dashboardData,
})

export const isDashLoading = loading => ({
  type: DASHBOARD_LOADING,
  loading,
})

