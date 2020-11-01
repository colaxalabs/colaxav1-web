import {
  LOAD_FARM_DATA,
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
    default:
      return state
  }
}

