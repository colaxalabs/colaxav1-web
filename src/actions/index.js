import {
  LOAD_NETWORK,
} from '../types'

// Actions
import {
  walletFound,
  walletConnected,
  connectWallet,
  disconnectWallet,
} from './wallet'
import {
  loadDashboard,
  isDashLoading,
  isUserDashLoading,
} from './dashboard'
import { loadCurrency } from './currency'
import { loadUser } from './user'

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
  walletConnected,
  connectWallet,
  disconnectWallet,
  isUserDashLoading,
  loadUser,
}

