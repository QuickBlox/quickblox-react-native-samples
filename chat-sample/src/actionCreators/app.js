import {
  INIT_QB_REQUEST_FAIL,
  INIT_QB_REQUEST_SUCCESS,
  INIT_QB_REQUEST,
} from '../constants'

export function appStart(config) {
  return { type: INIT_QB_REQUEST, payload: config }
}

export function appStartSuccess() {
  return { type: INIT_QB_REQUEST_SUCCESS }
}

export function appStartFail(error) {
  return { type: INIT_QB_REQUEST_FAIL, error }
}
