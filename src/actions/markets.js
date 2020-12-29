import {
  LOAD_MARKETS,
} from '../types'

export const loadMarkets = markets => ({
  type: LOAD_MARKETS,
  markets,
})

