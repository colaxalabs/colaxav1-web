import {
  LOAD_DASHBOARD,
} from '../types'

const INITIAL_STATE = {
  lands: 0,
  bookings: 0,
  traces: 0,
  txs: 0,
  farms: [],
}

export function dashboard(state = INITIAL_STATE, action = {}) {
  switch(action.type) {
    case LOAD_DASHBOARD:
      return {
        ...action.dashboardData,
      }
    default:
      return state
  }
}

