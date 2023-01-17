import {call, put, takeLatest} from 'redux-saga/effects';
import QB from 'quickblox-react-native-sdk';

import {
  loginFail,
  loginSuccess,
  logoutFail,
  logoutSuccess,
  sessionGetFail,
  sessionGetSuccess,
} from '../actionCreators';
import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGOUT_REQUEST,
  AUTH_GET_SESSION_REQUEST,
} from '../constants';

export function* loginSaga(action = {}) {
  const {login, password = 'quickblox', resolve, reject} = action.payload;
  try {
    const {session, user} = yield call(QB.auth.login, {login, password});
    const result = loginSuccess({session, user: {...user, password}});
    yield put(result);
    if (resolve) {
      resolve(result);
    }
  } catch (e) {
    const result = loginFail(e.message);
    yield put(result);
    if (reject) {
      reject(result);
    }
  }
}

export function* logout(action = {}) {
  const {resolve, reject} = action.payload;
  try {
    yield call(QB.auth.logout);
    const result = logoutSuccess();
    yield put(result);
    if (resolve) {
      resolve(result);
    }
    yield put(logoutSuccess());
  } catch (e) {
    const result = logoutFail(e.message);
    yield put(result);
    if (reject) {
      reject(result);
    }
  }
}

export function* getSession(action = {}) {
  const {resolve, reject} = action.payload;
  try {
    const session = yield call(QB.auth.getSession);
    const result = sessionGetSuccess(session);
    yield put(result);
    if (resolve) {
      resolve(result);
    }
  } catch (e) {
    const result = sessionGetFail(e.message);
    yield put(result);
    if (reject) {
      reject(result);
    }
  }
}

export default [
  takeLatest(AUTH_LOGIN_REQUEST, loginSaga),
  takeLatest(AUTH_LOGOUT_REQUEST, logout),
  takeLatest(AUTH_GET_SESSION_REQUEST, getSession),
];
