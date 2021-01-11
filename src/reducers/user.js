import {
  LOAD_USER_DASHBOARD,
  LISTEN_CONFIRM,
} from '../types'

const INITIAL_STATE = {
  lands: 0,
  totalBookings: 0,
  txs: '0',
  userFarms: [],
  userBookings: [],
}

export function user(state = INITIAL_STATE, action = {}) {
  switch(action.type) {
    case LOAD_USER_DASHBOARD:
      return {
        ...action.user,
      }
    case LISTEN_CONFIRM:
      return {
        ...state,
        txs: action.resp.bkTxs,
        userBookings: [...state.userBookings].map(book =>
        (Number(book.marketId) === Number(action.resp.id))
          ? { ...book, delivered: action.resp.delivered, volume: action.resp.bookerVolume }
          : book)
      }
    default:
      return state
  }
}

