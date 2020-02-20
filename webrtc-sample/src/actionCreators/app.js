import {
  CONNECTION_CHANGED,
  INIT_QB_REQUEST_FAIL,
  INIT_QB_REQUEST_SUCCESS,
  INIT_QB_REQUEST,
} from '../constants'

export function appStart(payload) {
  return { type: INIT_QB_REQUEST, payload }
}

export function appStartSuccess() {
  return { type: INIT_QB_REQUEST_SUCCESS }
}

export function appStartFail(error) {
  return { type: INIT_QB_REQUEST_FAIL, error }
}

export function connectionStateChanged(isConnected) {
  return { type: CONNECTION_CHANGED, payload: isConnected }
}
