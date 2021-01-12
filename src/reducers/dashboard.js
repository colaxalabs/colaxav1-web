import {
  LOAD_DASHBOARD,
  LISTEN_FOR_TOKENIZE,
  LISTEN_FOR_VOLUME,
  LISTEN_FOR_CREATE_MARKET,
  LISTEN_TRANSITION,
} from '../types'

const INITIAL_STATE = {
  lands: 0,
  markets: 0,
  txs: '0',
  farms: [],
}

export function dashboard(state = INITIAL_STATE, action = {}) {
  switch(action.type) {
    case LOAD_DASHBOARD:
      return {
        ...action.dashboardData,
      }
    case LISTEN_FOR_TOKENIZE:
      return {
        ...state,
        lands: action.lands,
      }
    case LISTEN_FOR_VOLUME:
      return {
        ...state,
        txs: action.txs,
      }
    case LISTEN_FOR_CREATE_MARKET:
      return {
        ...state,
        markets: action.markets,
      }
    case LISTEN_TRANSITION:
      return {
        ...state,
        farms: [...state.farms].map(farm =>
        (Number(farm.tokenId) === Number(action.resp.id)
          ? { ...farm, season: action.resp.season }
          : farm))
      }
    default:
      return state
  }
}

