import {
  DASHBOARD_LOADING,
  USER_DASH_LOADING,
  FARM_DASH_LOADING,
  FORM_SUBMITTING,
  CONFIRMING_FARM,
  OPENING_SEASON,
} from '../types'

const INITIAL_STATE = {
  dashLoading: false,
  userDashLoading: false,
  farmDashLoading: false,
  formSubmitting: false,
  confirmingFarm: false,
  openingSeason: false,
}

export function loading(state = INITIAL_STATE, action = {}) {
  switch(action.type) {
    case DASHBOARD_LOADING:
      return {
        ...state,
        dashboardLoading: action.loading.dashLoading,
      }
    case USER_DASH_LOADING:
      return {
        ...state,
        userDashLoading: action.loading.userDashLoading,
      }
    case FARM_DASH_LOADING:
      return {
        ...state,
        farmDashLoading: action.loading.farmDashLoading,
      }
    case FORM_SUBMITTING:
      return {
        ...state,
        formSubmitting: action.status.formSubmitting,
      }
    case CONFIRMING_FARM:
      return {
        ...state,
        confirmingFarm: action.status.confirmingFarm,
      }
    case OPENING_SEASON:
      return {
        ...state,
        openingSeason: action.status.openingSeason,
      }
    default:
      return state
  }
}

