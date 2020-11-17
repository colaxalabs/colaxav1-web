import {
  DASHBOARD_LOADING,
  USER_DASH_LOADING,
  FARM_DASH_LOADING,
  FORM_SUBMITTING,
  CONFIRMING_FARM,
  OPENING_SEASON,
  CONFIRMING_PREPARATION,
  CONFIRMING_PLANTING,
  CONFIRMING_GROWTH,
  CONFIRMING_HARVEST,
  BOOKING_HARVEST,
} from '../types'

const INITIAL_STATE = {
  dashLoading: false,
  userDashLoading: false,
  farmDashLoading: false,
  formSubmitting: false,
  confirmingFarm: false,
  openingSeason: false,
  confirmingPreparation: false,
  confirmingPlanting: false,
  confirmingGrowth: false,
  confirmingHarvest: false,
  booking: false,
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
    case CONFIRMING_PREPARATION:
      return {
        ...state,
        confirmingPreparation: action.status.confirmingPreparation,
      }
    case CONFIRMING_PLANTING:
      return {
        ...state,
        confirmingPlanting: action.status.confirmingPlanting,
      }
    case CONFIRMING_GROWTH:
      return {
        ...state,
        confirmingGrowth: action.status.confirmingGrowth,
      }
    case CONFIRMING_HARVEST:
      return {
        ...state,
        confirmingHarvest: action.status.confirmingHarvest,
      }
    case BOOKING_HARVEST:
      return {
        ...state,
        booking: action.status.booking,
      }
    default:
      return state
  }
}

