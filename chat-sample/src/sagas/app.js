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
  dialogGet,
  messagesGet,
} from '../actionCreators';
import {
  CHAT_CONNECT_AND_SUBSCRIBE,
  CHAT_CONNECT_SUCCESS,
  INIT_QB_REQUEST,
} from '../constants';
import {isChatConnected} from './chat';
import {getCurrentRoute} from '../Navigation';

export function* appStart(action = {}) {
  const config = action.payload;
  try {
    yield call(QB.settings.init, config);
    yield call(QB.settings.enableAutoReconnect, {enable: true});
    yield put(appStartSuccess());
  } catch (e) {
    yield put(appStartFail(e.message));
  }
}

export function* connectAndSubscribe() {
  const {dialogsLimit, dialogsLoading, ready, user} = yield select(state => ({
    dialogsLimit: state.dialogs.limit,
    dialogsLoading: state.dialogs.loading,
    ready: state.app.ready,
    user: state.auth.user,
  }));
  if (!user || !ready) {
    return;
  }
  if (!dialogsLoading) {
    // make API call to load latest dialogs
    yield put(dialogGet({append: true, limit: dialogsLimit, skip: 0}));
  }
  const route = getCurrentRoute();
  if (route) {
    const {name, params = {}} = route;
    // if dialog is opened - make API call and load latest messages for this chat
    if (name === 'Messages' && params.dialogId) {
      yield put(messagesGet({dialogId: params.dialogId}));
    }
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
  spawn(startAppStateListener),
];
