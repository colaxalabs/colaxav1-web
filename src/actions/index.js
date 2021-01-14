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
  listenTokenize,
  listenCreateMarket,
  listenVolume,
  listenTransition,
} from './dashboard'
import { loadCurrency } from './currency'
import { loadUser, listenBookingConfirmation } from './user'
import {
  loadFarm,
  tokenize,
  submitting,
  openSeason,
  confirmPreparation,
  confirmPlanting,
  confirmGrowth,
  confirmHarvest,
  bookHarvest,
  seasonClosure,
  gotoMarket,
  received,
  listenBooking,
  listenConfirmation,
  definiteClosure,
} from './farm'
import {
  collectDetails,
  collectMeasurements,
  collectFarmImage,
  collectLocation,
} from './form'
import {
  loadMarkets,
  loadMarketDash,
  listenBook,
  listenMarketing,
  listenMarketConfirmation,
  listenReviewing
} from './markets'

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
  bookHarvest,
  collectDetails,
  collectMeasurements,
  collectFarmImage,
  collectLocation,
  seasonClosure,
  loadMarkets,
  gotoMarket,
  loadMarketDash,
  received,
  listenTokenize,
  listenCreateMarket,
  listenVolume,
  listenBook,
  listenBookingConfirmation,
  listenTransition,
  listenBooking,
  listenConfirmation,
  listenMarketing,
  listenMarketConfirmation,
  listenReviewing,
  definiteClosure,
}

