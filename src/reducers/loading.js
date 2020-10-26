import {
  DASHBOARD_LOADING,
} from '../types'

export function loading(state = { dashLoading: false }, action = {}) {
  switch(action.type) {
    case DASHBOARD_LOADING:
      return {
        dashboardLoading: action.loading.dashLoading,
      }
    default:
      return state
  }
}

