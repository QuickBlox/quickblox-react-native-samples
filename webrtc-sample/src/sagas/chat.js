import {call, put, takeEvery} from 'redux-saga/effects';
import QB from 'quickblox-react-native-sdk';

import {
  chatConnectFail,
  chatConnectSuccess,
  chatDisconnectFail,
  chatDisconnectSuccess,
  chatIsConnectedFail,
  chatIsConnectedSuccess,
} from '../actionCreators';
import {
  AUTH_LOGOUT_REQUEST,
  CHAT_CONNECT_REQUEST,
  CHAT_DISCONNECT_REQUEST,
  CHAT_IS_CONNECTED_REQUEST,
} from '../constants';
import {showError} from '../NotificationService';

export function* isChatConnected() {
  try {
    const isConnected = yield call(QB.chat.isConnected);
    yield put(chatIsConnectedSuccess(isConnected));
    return isConnected;
  } catch (e) {
    yield put(chatIsConnectedFail(e.message));
  }
}

export function* chatConnect(action = {}) {
  const {userId, password} = action.payload;
  try {
    yield call(QB.chat.connect, {userId, password});
    yield put(chatConnectSuccess());
  } catch (e) {
    showError('Failed to connect to chat', e.message);
    yield put(chatConnectFail(e.message));
  }
}

export function* chatDisconnect() {
  try {
    yield call(QB.chat.disconnect);
    yield put(chatDisconnectSuccess());
  } catch (e) {
    showError('Failed to disconnect from chat', e.message);
    yield put(chatDisconnectFail(e.message));
  }
}

export default [
  takeEvery(CHAT_IS_CONNECTED_REQUEST, isChatConnected),
  takeEvery(CHAT_CONNECT_REQUEST, chatConnect),
  takeEvery([AUTH_LOGOUT_REQUEST, CHAT_DISCONNECT_REQUEST], chatDisconnect),
];
