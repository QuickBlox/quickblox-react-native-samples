import {
  INIT_QB_REQUEST_FAIL,
  INIT_QB_REQUEST_SUCCESS,
  INIT_QB_REQUEST,
  SETUP_TOKEN,
  START_SESSION_WITH_TOKEN_SUCCESS,
  START_SESSION_WITH_TOKEN_FAIL,
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

export function changeToken(token) {
  return {payload: token, type: SETUP_TOKEN};
}

export function startSessionWithTokenSuccess() {
  return {type: START_SESSION_WITH_TOKEN_SUCCESS};
}

export function startSessionWithTokenFail(error) {
  return {error, type: START_SESSION_WITH_TOKEN_FAIL};
}