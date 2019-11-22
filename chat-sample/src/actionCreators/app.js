import {
  INIT_QB_REQUEST_FAIL,
  INIT_QB_REQUEST_SUCCESS,
  INIT_QB_REQUEST,
  CONNECTION_STATE_CHANGE,
} from '../constants'

export function appStart() {
  return { type: INIT_QB_REQUEST }
}

export function appStartSuccess() {
  return { type: INIT_QB_REQUEST_SUCCESS }
}

export function appStartFail(error) {
  return { type: INIT_QB_REQUEST_FAIL, error }
}

export function connectionStateChanged(online) {
  return { type: CONNECTION_STATE_CHANGE, payload: online }
}