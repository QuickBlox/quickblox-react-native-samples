import {eventChannel} from 'redux-saga';
import {
  call,
  cancel,
  cancelled,
  fork,
  put,
  race,
  select,
  take,
} from 'redux-saga/effects';
import QB from 'quickblox-react-native-sdk';
import {NativeEventEmitter} from 'react-native';

import {
  dialogEditSuccess,
  dialogUnreadCountIncrement,
  messageMarkDelivered,
  dialogGet,
} from '../actionCreators';
import {
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT_SUCCESS,
  CHAT_CONNECT_REQUEST,
  CHAT_DISCONNECT_SUCCESS,
  INIT_QB_REQUEST_SUCCESS,
} from '../constants';

function* handlewNewMessage(message) {
  const {currentUser, dialogs, limit} = yield select(state => ({
    currentUser: state.auth.user,
    dialogs: state.dialogs.dialogs,
    limit: state.dialogs.limit,
  }));
  const dialog = dialogs.find(d => d.id === message.dialogId);
  if (dialog) {
    yield put(
      dialogEditSuccess({
        ...dialog,
        lastMessage: message.body,
        lastMessageDateSent: message.dateSent,
        lastMessageUserId: message.senderId,
      }),
    );
    if (currentUser && message.senderId !== currentUser.id) {
      if (!message.markable) {
        yield put(messageMarkDelivered(message));
      }
      if (dialog.type !== QB.chat.DIALOG_TYPE.PUBLIC_CHAT) {
        yield put(
          dialogUnreadCountIncrement({
            dialogId: message.dialogId,
          }),
        );
      }
    }
  } else {
    // re-load dialogs to get new dialog(s) or update occupants list
    yield put(dialogGet({append: false, limit, skip: 0}));
  }
}

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
      const {type, payload} = event;
      if (type === QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE) {
        yield call(handlewNewMessage, payload);
      } else if (type === QB.chat.EVENT_TYPE.RECEIVED_SYSTEM_MESSAGE) {
        const limit = yield select(({dialogs}) => dialogs.limit);
        yield put(dialogGet({append: true, limit, skip: 0}));
      }
    }
  } catch (e) {
    yield put({error: e.message, type: 'CHAT_EVENTS_CHANNEL_ERROR'});
  } finally {
    if (yield cancelled()) {
      channel.close();
    }
  }
}

function* subscribeToChatEvents() {
  while (true) {
    let task;
    const {connect} = yield race({
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
