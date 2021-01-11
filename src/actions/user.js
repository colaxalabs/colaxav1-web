import {
  LOAD_USER_DASHBOARD,
  LISTEN_CONFIRM,
} from '../types'

export const loadUser = user => ({
  type: LOAD_USER_DASHBOARD,
  user,
})

export const listenBookingConfirmation = resp => ({
  type: LISTEN_CONFIRM,
  resp,
})

