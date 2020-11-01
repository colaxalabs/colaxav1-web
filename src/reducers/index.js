import { combineReducers } from 'redux'

// Reducers
import { wallet } from './wallet'
import { network } from './network'
import { dashboard } from './dashboard'
import { loading } from './loading'
import { currency } from './currency'
import { user } from './user'
import { farm } from './farm'

export default combineReducers({
  wallet,
  network,
  dashboard,
  loading,
  currency,
  user,
  farm,
})

