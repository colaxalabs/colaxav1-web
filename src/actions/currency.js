import {
  LOAD_CONVERSION_RATE,
} from '../types'

export const loadCurrency = currency => ({
  type: LOAD_CONVERSION_RATE,
  currency,
})

