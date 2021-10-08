import {
  AUTH_GET_SESSION_FAIL,
  AUTH_GET_SESSION_REQUEST,
  AUTH_GET_SESSION_SUCCESS,
  AUTH_LOGIN_FAIL,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT_FAIL,
  AUTH_LOGOUT_REQUEST,
  AUTH_LOGOUT_SUCCESS,
} from '../constants';

export function sessionGet() {
  return {type: AUTH_GET_SESSION_REQUEST};
}

export function sessionGetSuccess(session) {
  return {payload: session, type: AUTH_GET_SESSION_SUCCESS};
}

export function sessionGetFail(error) {
  return {error, type: AUTH_GET_SESSION_FAIL};
}

export function loginRequest(payload) {
  return {payload, type: AUTH_LOGIN_REQUEST};
}

export function loginSuccess({session, user}) {
  return {payload: {session, user}, type: AUTH_LOGIN_SUCCESS};
}

export function loginFail(error) {
  return {error, type: AUTH_LOGIN_FAIL};
}

export function logoutRequest() {
  return {type: AUTH_LOGOUT_REQUEST};
}

export function logoutSuccess() {
  return {type: AUTH_LOGOUT_SUCCESS};
}

export function logoutFail(error) {
  return {error, type: AUTH_LOGOUT_FAIL};
}
