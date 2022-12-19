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
  dialogEditSuccess,
  dialogUpdateTypingStatus,
  dialogGet,
  chatReconnectSuccess,
  messagesGet,
  receivedNewMessage,
} from '../actionCreators';
import {
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT_SUCCESS,
  CHAT_CONNECT_REQUEST,
  CHAT_DISCONNECT_SUCCESS,
  INIT_QB_REQUEST_SUCCESS,
  NOTIFICATION_TYPE_CREATED,
  NOTIFICATION_TYPE_ADDED,
  NOTIFICATION_TYPE_LEAVE,
} from '../constants';
import {getCurrentRoute} from '../Navigation';
import {showSuccess} from '../NotificationService';



function* handleUserTyping(payload) {
  const { currentUser, dialogs, activeDialogId } = yield select(state => ({
    currentUser: state.auth.user,
    dialogs: state.dialogs.dialogs,
    activeDialogId: state.dialogs.activeDialogId,
  }));
  const { dialogId, userId, isTyping } = payload;
  if (userId === currentUser.id) {
    return;
  }
  if (!activeDialogId || activeDialogId !== dialogId) {
    return;
  }
  if (!dialogs.some(dialog => dialog.id === dialogId)) {
    return;
  }
  const params = {
    dialogId,
    userId,
    isTyping,
  }
  yield put(dialogUpdateTypingStatus(params));
}

function* handleNewMessage(message) {
  const {currentUser, dialogs, limit, allIds} = yield select(state => ({
    currentUser: state.auth.user,
    dialogs: state.dialogs.dialogs,
    limit: state.dialogs.limit,
    allIds: state.messages.messages.allIds,
  }));

  if (allIds.includes(message.id)) {
    return;
  }

  const dialog = dialogs.find(d => d.id === message.dialogId);
  if (dialog) {
    const params = {
      ...dialog,
      lastMessage: message.body,
      lastMessageDateSent: message.dateSent,
      lastMessageUserId: message.senderId,
    }

    const isMyMessage = currentUser && message.senderId === currentUser.id;
    const needIncrement = (dialog.type === QB.chat.DIALOG_TYPE.GROUP_CHAT
      || dialog.type === QB.chat.DIALOG_TYPE.CHAT)
      && !isMyMessage;

    if (needIncrement) {
      params.unreadMessagesCount = (dialog.unreadMessagesCount || 0) + 1;
    }

    if (message.properties && message.properties.notification_type) {
      if (message.properties.notification_type === NOTIFICATION_TYPE_ADDED) {
        const newOccupantsIds = message.properties.new_occupants_ids.split(',').map(Number);
        const occupantsIds = new Set([...dialog.occupantsIds, ...newOccupantsIds]);
        params.occupantsIds = Array.from(occupantsIds);
      } else if (message.properties.notification_type === NOTIFICATION_TYPE_LEAVE) {
        params.occupantsIds = dialog.occupantsIds.filter((value) => value !== message.senderId);
      }
    }

    if (!isMyMessage) {
      yield spawn(handleUserTyping, { dialogId: dialog.id, userId: message.senderId, isTyping: false });
    }

    yield put(dialogEditSuccess(params));
    yield put(receivedNewMessage(message));
  } else {
    // re-load dialogs to get new dialog(s) or update occupants list
    yield put(dialogGet({ append: false, limit, skip: 0 }));
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
      const { type, payload } = event;
      switch (type) {
        case QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE:
          yield call(handleNewMessage, payload);
          break;
        case QB.chat.EVENT_TYPE.RECEIVED_SYSTEM_MESSAGE:
          const allNotify = [NOTIFICATION_TYPE_CREATED, NOTIFICATION_TYPE_ADDED];
          const haveNotificationType = allNotify.includes(payload.properties.notification_type);
          if (haveNotificationType) {
            const limit = yield select(({ dialogs }) => dialogs.limit);
            yield put(dialogGet({ append: true, limit, skip: 0 }));
          }
          break;
        case QB.chat.EVENT_TYPE.RECONNECTION_SUCCESSFUL:
          yield put(chatReconnectSuccess());
          const route = getCurrentRoute();
          const { name, params = {} } = route;
          if (route && name === 'Messages' && params.dialogId) {
            yield put(messagesGet({ dialogId: params.dialogId }));
          }
          break;
        case QB.chat.EVENT_TYPE.USER_IS_TYPING:
          yield call(handleUserTyping, {...payload, isTyping: true});
          break;
        case QB.chat.EVENT_TYPE.USER_STOPPED_TYPING:
          yield call(handleUserTyping, {...payload, isTyping: false});
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
