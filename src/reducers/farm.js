import {
  LOAD_FARM_DATA,
  OPEN_SEASON,
  CLOSE_PREPARATION,
  CLOSE_PLANTING,
  CLOSE_GROWTH,
  FINISH_HARVEST,
  CLOSING_FARM_SEASON,
  SEASON_MARKETED,
} from '../types'

const INITIAL_STATE = {
  tokenId: 0,
  totalBookings: 0,
  txs: 0,
  season: '',
  seasonMarketed: false,
  img: '',
  owner: '',
  lat: 0.0,
  lon: 0.0,
  completedSeasons: 0,
  size: '',
  location: '',
  currentSeason: '',
  seasonCrop: '',
  seasonSupply: '',
  seasonSupplyUnit: 'KG',
  soil: '',
  currentSeasonSupply: 0,
  farmBookings: [],
  traceId: '',
}

export function farm(state = INITIAL_STATE, action = {}) {
  switch(action.type) {
    case LOAD_FARM_DATA:
      return {
        ...state,
        ...action.farm,
      }
    case OPEN_SEASON:
      return {
        ...state,
        season: action.farm.season,
      }
    case CLOSE_PREPARATION:
      return {
        ...state,
        season: action.farm.season,
      }
    case CLOSE_PLANTING:
      return {
        ...state,
        season: action.farm.season,
      }
    case CLOSE_GROWTH:
      return {
        ...state,
        season: action.farm.season,
      }
    case FINISH_HARVEST:
      return {
        ...state,
        season: action.farm.season,
        completedSeasons: action.farm.completedSeasons,
        traceId: action.farm.traceId,
        seasonCrop: action.farm.seasonCrop,
        seasonSupply: action.farm.seasonSupply,
      }
    case CLOSING_FARM_SEASON:
      return {
        ...state,
        season: action.farm.season,
      }
    case SEASON_MARKETED:
      return {
        ...state,
        seasonMarketed: action.farm.seasonMarketed,
        currentSeasonSupply: action.farm.currentSeasonSupply,
      }
    default:
      return state
  }
}

