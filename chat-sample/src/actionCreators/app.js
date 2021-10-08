import {
  INIT_QB_REQUEST_FAIL,
  INIT_QB_REQUEST_SUCCESS,
  INIT_QB_REQUEST,
} from '../constants';

export function appStart(config) {
  return {payload: config, type: INIT_QB_REQUEST};
}

export function appStartSuccess() {
  return {type: INIT_QB_REQUEST_SUCCESS};
}

export function appStartFail(error) {
  return {error, type: INIT_QB_REQUEST_FAIL};
}
