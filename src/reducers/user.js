import {
  LOAD_USER_DASHBOARD,
} from '../types'

const INITIAL_STATE = {
  lands: 0,
  totalBookings: 0,
  txs: 0,
  userFarms: [],
  userBookings: [],
}

export function user(state = INITIAL_STATE, action = {}) {
  switch(action.type) {
    case LOAD_USER_DASHBOARD:
      return {
        ...action.user,
      }
    default:
      return state
  }
}

