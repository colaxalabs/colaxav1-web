import {
  LOAD_USER_DASHBOARD,
} from '../types'

export const loadUser = user => ({
  type: LOAD_USER_DASHBOARD,
  user,
})

