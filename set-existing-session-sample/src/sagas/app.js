import {eventChannel} from 'redux-saga';
import {
  call,
  delay,
  fork,
  put,
  race,
  select,
  spawn,
  take,
  takeLatest,
} from 'redux-saga/effects';
import {AppState, Platform} from 'react-native';
import QB from 'quickblox-react-native-sdk';

import {
  appStartFail,
  appStartSuccess,
  chatConnect,
  chatConnectAndSubscribe,
  chatDisconnect,
  startSessionWithTokenSuccess,
  startSessionWithTokenFail,
} from '../actionCreators';
import {
  CHAT_CONNECT_AND_SUBSCRIBE,
  CHAT_CONNECT_SUCCESS,
  INIT_QB_REQUEST,
  START_WITH_TOKEN,
} from '../constants';
import {isChatConnected} from './chat';
import config from '../QBConfig';

export function* appStart(action = {}) {
  const {resolve, reject} = action.payload;
  console.log('appStart');
  console.log('config', config);
  try {
    yield call(QB.settings.init, config);
    yield call(QB.settings.enableAutoReconnect, {enable: true});
    const result = appStartSuccess();
    yield put(result);
    if (resolve) {
      resolve(result);
    }
  } catch (e) {
    const result = appStartFail(e.message);
    yield put(result);
    if (reject) {
      reject(result);
    }
  }
}

export function* startSessionWithToken(action = {}) {
  const {token, resolve, reject} = action.payload;
  console.log('!!!!!!!!!!! startSessionWithToken token ', token);
  try {
    yield call(QB.auth.startSessionWithToken, token);
    const result = startSessionWithTokenSuccess();
    yield put(result);
    if (resolve) {
      resolve(result);
    }
  } catch (e) {
    const result = startSessionWithTokenFail(e.message);
    yield put(result);
    if (reject) {
      reject(result);
    }
  }
}

export function* connectAndSubscribe() {
  const {ready, user} = yield select(state => ({
    ready: state.app.ready,
    user: state.auth.user,
  }));
  if (!user || !ready) {
    return;
  }

  let chatConnected = false;
  while (!chatConnected) {
    chatConnected = yield call(isChatConnected);
    if (!chatConnected) {
      // connect to chat if not connected
      yield put(
        chatConnect({
          password: user.password,
          userId: user.id,
        }),
      );
      const {success} = yield race({
        success: take([CHAT_CONNECT_SUCCESS, QB.chat.EVENT_TYPE.CONNECTED]),
        timeout: delay(10000),
      });
      if (success) {
        chatConnected = true;
      }
    }
  }
}

function createAppStateChannel() {
  return eventChannel(emit => {
    const subscription = AppState.addEventListener('change', emit);
    return subscription.remove;
  });
}

export function* startAppStateListener() {
  try {
    const appStateChannel = yield call(createAppStateChannel);
    while (true) {
      let nextAppState = yield take(appStateChannel);
      if (Platform.OS === 'ios') {
        while (true) {
          const {debounce, latestAppState} = yield race({
            debounce: delay(100),
            latestAppState: take(appStateChannel),
          });
          if (debounce) {
            yield fork(appStateChangeHandler, nextAppState);
            break;
          }
          nextAppState = latestAppState;
        }
      } else {
        yield call(appStateChangeHandler, nextAppState);
      }
    }
  } catch (e) {
    yield put({error: e.message, type: 'APP_STATE_CHANNEL_ERROR'});
  }
}

function* appStateChangeHandler(appState) {
  const {connected, user} = yield select(({auth, chat}) => ({
    connected: chat.connected,
    user: auth.user,
  }));
  if (user) {
    if (appState.match(/background/)) {
      if (connected) {
        yield put(chatDisconnect());
      }
    } else {
      yield put(chatConnectAndSubscribe());
    }
  }
}

export default [
  takeLatest(INIT_QB_REQUEST, appStart),
  takeLatest(CHAT_CONNECT_AND_SUBSCRIBE, connectAndSubscribe),
  takeLatest(START_WITH_TOKEN, startSessionWithToken),
  spawn(startAppStateListener),
];
