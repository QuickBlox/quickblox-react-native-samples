import {call, put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import QB from 'quickblox-react-native-sdk';

import {
  usersCreateFail,
  usersCreateSuccess,
  usersGetFail,
  usersGetSuccess,
  usersUpdateFail,
  usersUpdateSuccess,
} from '../actionCreators';
import {
  USERS_CREATE_REQUEST,
  USERS_GET_REQUEST,
  USERS_UPDATE_REQUEST,
} from '../constants';
import {showError} from '../NotificationService';
import {generateColor} from '../utils/utils';

const defaultQuery = {
  append: false,
  page: 1,
  perPage: 30,
  sort: {
    ascending: false,
    field: QB.users.USERS_FILTER.FIELD.LAST_REQUEST_AT,
    type: QB.users.USERS_FILTER.TYPE.DATE,
  },
};

export function* createUser(action = {}) {
  const {resolve, reject, ...userData} = action.payload;
  try {
    const user = yield call(QB.users.create, userData);
    const result = usersCreateSuccess(user);
    yield put(result);
    if (resolve) {
      resolve(result);
    }
  } catch (e) {
    const result = usersCreateFail(e.message);
    yield put(result);
    if (reject) {
      reject(result);
    }
  }
}

export function* getUsers(action = {}) {
  try {
    const request = action.payload || {};
    const savedUsers = yield select(({users}) => users.users);
    const {append, ...query} = Object.assign({}, defaultQuery, request);
    const response = yield call(QB.users.getUsers, query);
    const usersWithColor = response.users.map(user => {
      const savedUser = savedUsers.find(u => u.id === user.id);
      const color =
        savedUser && savedUser.color ? savedUser.color : generateColor(user.id.toString());
      return {...user, color};
    });
    const result = usersGetSuccess({
      append,
      page: response.page,
      perPage: response.perPage,
      total: response.total,
      users: usersWithColor,
    });
    yield put(result);
    return result;
  } catch (e) {
    const result = usersGetFail(e.message);
    yield put(result);
    showError('Failed to get users', e.message);
    return result;
  }
}

export function* updateUser(action = {}) {
  const {resolve, reject, ...userData} = action.payload;
  try {
    const user = yield call(QB.users.update, userData);
    const result = usersUpdateSuccess(user);
    yield put(result);
    if (resolve) {
      resolve(result);
    }
  } catch (e) {
    const result = usersUpdateFail(e.message);
    yield put(result);
    if (reject) {
      reject(result);
    }
  }
}

export default [
  takeLatest(USERS_CREATE_REQUEST, createUser),
  takeEvery(USERS_GET_REQUEST, getUsers),
  takeLatest(USERS_UPDATE_REQUEST, updateUser),
];
