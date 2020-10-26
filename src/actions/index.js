import {
  LOAD_NETWORK,
} from '../types'

// Actions
import { walletFound } from './wallet'

const networkFound = net => ({
  type: LOAD_NETWORK,
  net,
})

export {
  networkFound,
  walletFound,
}

