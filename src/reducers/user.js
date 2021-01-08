import {
  LOAD_USER_DASHBOARD,
  CONFIRM_RECEIVED,
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
    case CONFIRM_RECEIVED:
      return {
        ...state,
        txs: action.resp.txs,
        userBookings: [...state.userBookings].map(book =>
          (Number(book.marketId) === Number(action.resp.id))
          ? { ...book, delivered: (Number(book.volume) - Number(action.resp.volume)) === 0, volume: Number(book.volume) - Number(action.resp.volume) }
          : book
        )
      }
    default:
      return state
  }
}

