import {
  WALLET_FOUND,
} from '../types'

export const walletFound = wallet => ({
  type: WALLET_FOUND,
  wallet,
})

