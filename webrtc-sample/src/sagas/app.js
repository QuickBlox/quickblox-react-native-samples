import {eventChannel} from 'redux-saga';
import {
  call,
  delay,
  fork,
  put,
  race,
  select,
  take,
  takeLeading,
} from 'redux-saga/effects';
import {AppState, Platform} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import QB from 'quickblox-react-native-sdk';

import {isChatConnected} from './chat';
import {
  appStartFail,
  appStartSuccess,
  chatConnect,
  chatConnectAndSubscribe,
  chatDisconnect,
  connectionStateChanged,
  webrtcInit,
  webrtcRelease,
} from '../actionCreators';
import {
  CHAT_CONNECT_AND_SUBSCRIBE,
  CHAT_CONNECT_SUCCESS,
  INIT_QB_REQUEST,
} from '../constants';

export function* appStart(action = {}) {
  const config = action.payload;
  try {
    yield call(QB.settings.init, config);
    yield call(
      QB.rtcconfig.setAnswerTimeInterval,
      // eslint-disable-next-line no-undef
      globalThis.ANSWER_TIME_INTERVAL,
    );
    yield call(QB.rtcconfig.setDialingTimeInterval, 5);
    yield put(appStartSuccess());
    yield fork(startAppStateListener);
    yield fork(startNetInfoStateListener);
  } catch (e) {
    yield put(appStartFail(e.message));
  }
}

export function* connectAndSubscribe() {
  const {ready, user} = yield select(state => ({
    ready: state.app.ready,
    user: state.auth.user,
  }));
  if (!ready || !user) {
    return;
  }
  let chatConnected = false;
  while (!chatConnected) {
    chatConnected = yield call(isChatConnected);
    if (!chatConnected) {
      // connect to chat if not connected
      yield put(
        chatConnect({
          userId: user.id,
          password: user.password,
        }),
      );
      const {success} = yield race({
        success: take([CHAT_CONNECT_SUCCESS, QB.chat.EVENT_TYPE.CONNECTED]),
        timeout: delay(5000),
      });
      if (success) {
        chatConnected = true;
      }
    }
  }
  yield put(webrtcInit());
}

function createAppStateChannel() {
  return eventChannel(emit => {
    AppState.addEventListener('change', emit);
    return () => AppState.removeEventListener('change', emit);
  });
}

function createNetInfoChannel() {
  return eventChannel(NetInfo.addEventListener);
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
    yield put({type: 'APP_STATE_LISTENER_ERROR', error: e.message});
  }
}

export function* startNetInfoStateListener() {
  try {
    const channel = yield call(createNetInfoChannel);
    while (true) {
      const state = yield take(channel);
      const storedConnectionState = yield select(({app}) => app.connected);
      if (state.isConnected === storedConnectionState) {
        continue;
      }
      yield put(connectionStateChanged(state.isConnected));
      if (state.isConnected) {
        yield put(chatConnectAndSubscribe());
      }
    }
  } catch (e) {
    yield put({type: 'NETINFO_CHANNEL_ERROR', error: e.message});
  }
}

function* appStateChangeHandler(appState) {
  const {connected, session} = yield select(({chat, webrtc}) => ({
    connected: chat.connected,
    session: webrtc.session,
  }));
  if (appState.match(/inactive|background/)) {
    if (connected && !session) {
      yield put(chatDisconnect());
      yield put(webrtcRelease());
    }
  } else {
    yield put(chatConnectAndSubscribe());
  }
}

export default [
  takeLeading(INIT_QB_REQUEST, appStart),
  takeLeading(CHAT_CONNECT_AND_SUBSCRIBE, connectAndSubscribe),
];
