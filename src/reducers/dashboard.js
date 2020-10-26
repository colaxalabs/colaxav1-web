import {
  LOAD_DASHBOARD,
} from '../types'

export function dashboard(state = {}, action = {}) {
  switch(action.type) {
    case LOAD_DASHBOARD:
      return {
        ...action.dashboardData,
      }
    default:
      return state
  }
}

