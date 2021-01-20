import {
  LOAD_USER_DASHBOARD,
  LISTEN_CONFIRM,
  LISTEN_TRANSITION,
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
        (Number(book.marketId) === Number(action.resp.id) && Number(book.season) === Number(action.resp.seasonNo))
          ? { ...book, delivered: action.resp.delivered, deposit: action.resp.deposit, volume: action.resp.bookerVolume }
          : book)
      }
    case LISTEN_TRANSITION:
      return {
        ...state,
        userFarms: [...state.userFarms].map(farm =>
        (Number(farm.tokenId) === Number(action.resp.id))
          ? { ...farm, season: action.resp.season }
          : farm)
      }
    default:
      return state
  }
}

