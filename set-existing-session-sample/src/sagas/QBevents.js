import {eventChannel} from 'redux-saga';
import {
  call,
  cancel,
  cancelled,
  fork,
  put,
  race,
  select,
  spawn,
  take,
} from 'redux-saga/effects';
import QB from 'quickblox-react-native-sdk';
import {NativeEventEmitter} from 'react-native';

import {
  chatReconnectSuccess,
} from '../actionCreators';
import {
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT_SUCCESS,
  CHAT_CONNECT_REQUEST,
  CHAT_DISCONNECT_SUCCESS,
  INIT_QB_REQUEST_SUCCESS,
} from '../constants';

import {showError} from '../NotificationService';

function createChatEventsChannel() {
  return eventChannel(emitter => {
    const chatEmitter = new NativeEventEmitter(QB.chat);
    const subscriptions = Object.keys(QB.chat.EVENT_TYPE).map(key =>
      chatEmitter.addListener(QB.chat.EVENT_TYPE[key], emitter),
    );
    return () => {
      while (subscriptions.length) {
        const subscription = subscriptions.pop();
        subscription.remove();
      }
    };
  });
}

function* processChatEvents() {
  const channel = yield call(createChatEventsChannel);
  try {
    while (true) {
      const event = yield take(channel);
      yield put(event);
      const { type, payload } = event;
      switch (type) {
        case QB.auth.EVENT_TYPE.SESSION_EXPIRED:
          showError('Session Expired');
          break;
        case QB.chat.EVENT_TYPE.RECONNECTION_SUCCESSFUL:
          yield put(chatReconnectSuccess());
          break;
      }
    }
  } catch (e) {
    yield put({ error: e.message, type: 'CHAT_EVENTS_CHANNEL_ERROR' });
  } finally {
    if (yield cancelled()) {
      channel.close();
    }
  }
}

function* subscribeToChatEvents() {
  while (true) {
    let task;
    const { connect } = yield race({
      connect: take(CHAT_CONNECT_REQUEST),
      disconnect: take(CHAT_DISCONNECT_SUCCESS),
    });
    if (task) {
      yield cancel(task);
    }
    if (connect) {
      task = yield fork(processChatEvents);
    }
  }
}

function* QBChatEventsSaga() {
  yield take(INIT_QB_REQUEST_SUCCESS);
  while (true) {
    const loggedIn = yield select(({auth}) => auth.loggedIn);
    if (!loggedIn) {
      yield take(AUTH_LOGIN_SUCCESS);
    }
    yield race([call(subscribeToChatEvents), take(AUTH_LOGOUT_SUCCESS)]);
  }
}

export default [QBChatEventsSaga()];
