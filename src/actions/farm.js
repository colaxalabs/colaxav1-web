import {
  LOAD_FARM_DATA,
} from '../types'

export const loadFarm = farm => ({
  type: LOAD_FARM_DATA,
  farm,
})

