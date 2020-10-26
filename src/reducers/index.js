import { combineReducers } from 'redux'

// Reducers
import { wallet } from './wallet'
import { network } from './network'
import { dashboard } from './dashboard'
import { loading } from './loading'

export default combineReducers({
  wallet,
  network,
  dashboard,
  loading,
})

