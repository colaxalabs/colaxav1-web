import { combineReducers } from 'redux'

// Reducers
import { wallet } from './wallet'
import { network } from './network'

export default combineReducers({
  wallet,
  network,
})

