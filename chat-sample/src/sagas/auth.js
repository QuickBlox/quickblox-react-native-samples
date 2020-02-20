import { call, put, takeLatest } from 'redux-saga/effects'
import QB from 'quickblox-react-native-sdk'

import {
  loginFail,
  loginSuccess,
  logoutFail,
  logoutSuccess,
  sessionGetFail,
  sessionGetSuccess,
} from '../actionCreators'
import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGOUT_REQUEST,
  AUTH_GET_SESSION_REQUEST,
} from '../constants'
import { showError } from '../NotificationService'

export function* login(action = {}) {
  const { login, password = 'quickblox', resolve, reject } = action.payload
  try {
    const { session, user } = yield call(QB.auth.login, { login, password })
    const result = loginSuccess({ session, user: { ...user, password } })
    yield put(result)
    if (resolve) resolve(result)
  } catch (e) {
    const result = loginFail(e.message)
    yield put(result)
    if (reject) reject(result)
  }
}

export function* logout() {
  try {
    yield call(QB.auth.logout)
    yield put(logoutSuccess())
  } catch (e) {
    yield put(logoutFail(e.message))
    showError(e.message)
  }
}

export function* getSession() {
  try {
    const session = yield call(QB.auth.getSession)
    yield put(sessionGetSuccess(session))
    return session
  } catch (e) {
    yield put(sessionGetFail(e.message))
  }
}

export default [
  takeLatest(AUTH_LOGIN_REQUEST, login),
  takeLatest(AUTH_LOGOUT_REQUEST, logout),
  takeLatest(AUTH_GET_SESSION_REQUEST, getSession),
]
