import {
  LOAD_FARM_DATA,
  OPEN_SEASON,
} from '../types'

const INITIAL_STATE = {
  tokenId: 0,
  totalBookings: 0,
  txs: 0,
  season: '',
  img: '',
  owner: '',
  lat: 0.0,
  lon: 0.0,
  completedSeasons: 0,
  size: '',
  location: '',
  soil: '',
  seasons: [],
  farmBookings: [],
}

export function farm(state = INITIAL_STATE, action = {}) {
  switch(action.type) {
    case LOAD_FARM_DATA:
      return {
        ...action.farm,
      }
    case OPEN_SEASON:
      return {
        ...state,
        season: action.farm.season,
      }
    default:
      return state
  }
}

