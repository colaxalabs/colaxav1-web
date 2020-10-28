import {
  DASHBOARD_LOADING,
  USER_DASH_LOADING,
} from '../types'

const INITIAL_STATE = {
  dashLoading: false,
  userDashLoading: false,
}

export function loading(state = INITIAL_STATE, action = {}) {
  switch(action.type) {
    case DASHBOARD_LOADING:
      return {
        ...state,
        dashboardLoading: action.loading.dashLoading,
      }
    case USER_DASH_LOADING:
      return {
        ...state,
        userDashLoading: action.loading.userDashLoading,
      }
    default:
      return state
  }
}

