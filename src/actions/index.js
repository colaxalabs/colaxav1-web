import {
  LOAD_NETWORK,
} from '../types'

// Actions
import { walletFound } from './wallet'
import {
  loadDashboard,
  isDashLoading,
} from './dashboard'
import { loadCurrency } from './currency'

const networkFound = net => ({
  type: LOAD_NETWORK,
  net,
})

export {
  networkFound,
  walletFound,
  loadDashboard,
  isDashLoading,
  loadCurrency,
}

