import {
  LOAD_NETWORK,
} from '../types'

// Actions
import {
  walletFound,
  walletConnected,
  connectWallet,
  disconnectWallet,
  connectLocation,
  walletChange,
} from './wallet'
import {
  loadDashboard,
  isDashLoading,
  isUserDashLoading,
  isFarmDashLoading,
} from './dashboard'
import { loadCurrency } from './currency'
import { loadUser } from './user'
import {
  loadFarm,
  tokenize,
  submitting,
  openSeason,
  confirmPreparation,
  confirmPlanting,
  confirmGrowth,
  confirmHarvest,
} from './farm'

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
  isFarmDashLoading,
  loadFarm,
  tokenize,
  connectLocation,
  submitting,
  walletChange,
  openSeason,
  confirmPreparation,
  confirmPlanting,
  confirmGrowth,
  confirmHarvest,
}

