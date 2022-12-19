import {
  all,
  call,
  put,
  select,
  take,
  takeEvery,
  takeLatest,
  takeLeading,
} from 'redux-saga/effects';
import QB from 'quickblox-react-native-sdk';

import {
  dialogCreateFail,
  dialogCreateSuccess,
  dialogEditFail,
  dialogEditSuccess,
  dialogGet,
  dialogGetFail,
  dialogGetSuccess,
  dialogsJoin,
  dialogsJoinFail,
  dialogsJoinSuccess,
  dialogsLeaveFail,
  dialogsLeaveSuccess,
  dialogStartTypingFail,
  dialogStartTypingSuccess,
  dialogStopTypingFail,
  dialogStopTypingSuccess,
  messageSystemSend,
} from '../actionCreators';
import {
  CHAT_CONNECT_SUCCESS,
  CHAT_RECONNECT_SUCCESS,
  DIALOGS_CREATE_REQUEST,
  DIALOGS_EDIT_REQUEST,
  DIALOGS_GET_REQUEST,
  DIALOGS_JOIN_REQUEST,
  DIALOGS_LEAVE_REQUEST,
  DIALOGS_START_TYPING_REQUEST,
  DIALOGS_STOP_TYPING_REQUEST,
  MESSAGES_GET_SUCCESS,
  NOTIFICATION_TYPE_CREATED,
  NOTIFICATION_TYPE_ADDED,
} from '../constants';
import { showError } from '../NotificationService';
import { generateColor } from '../utils/utils';

export function* getDialogs(action = {}) {
  const { resolve, reject, append, ...params } = action.payload || {};
  try {
    const savedDialogs = yield select(({ dialogs }) => dialogs.dialogs);
    const response = yield call(QB.chat.getDialogs, params);
    let usersIds = new Set();
    const joinToDialogs = [];
    for (const dialog of response.dialogs) {
      if ((dialog.type === QB.chat.DIALOG_TYPE.GROUP_CHAT ||
        dialog.type === QB.chat.DIALOG_TYPE.CHAT)) {
        usersIds = new Set([...usersIds, ...dialog.occupantsIds]);
      }
      if ((dialog.type === QB.chat.DIALOG_TYPE.GROUP_CHAT ||
        dialog.type === QB.chat.DIALOG_TYPE.PUBLIC_CHAT)) {
        joinToDialogs.push(dialog.id);
      }
      const savedDialog = savedDialogs.find(d => d.id === dialog.id);
      if (savedDialog && savedDialog.color) {
        dialog.color = savedDialog.color;
      } else {
        dialog.color = generateColor(dialog.id);
      }
    }
    yield put(dialogGetSuccess({ ...response, append }));
    if (resolve) {
      resolve(usersIds);
    }
    if (joinToDialogs.length) {
      yield put(dialogsJoin(joinToDialogs));
    }
  } catch (e) {
    const result = dialogGetFail(e.message);
    yield put(result);
    if (reject) {
      reject(result);
    }
  }
}

export function* createDialog(action = {}) {
  const { resolve, reject, ...data } = action.payload;
  try {
    const dialog = yield call(QB.chat.createDialog, data);
    let dialogId = dialog.id;
    if ((dialog.type === QB.chat.DIALOG_TYPE.GROUP_CHAT ||
      dialog.type === QB.chat.DIALOG_TYPE.PUBLIC_CHAT)) {
      yield call(QB.chat.joinDialog, { dialogId });
    }
    dialog.color = generateColor(dialog.id);
    const result = dialogCreateSuccess(dialog);
    yield put(result);
    yield call(notifySystemMessage, dialog.id, dialog.occupantsIds, NOTIFICATION_TYPE_CREATED);
    if (resolve) {
      resolve(result);
    }
  } catch (e) {
    const result = dialogCreateFail(e.message);
    yield put(result);
    if (reject) {
      reject(result);
    }
  }
}

export function* updateDialog(action = {}) {
  const { resolve, reject, ...update } = action.payload;
  try {
    const dialog = yield call(QB.chat.updateDialog, update);
    const result = dialogEditSuccess(dialog);
    yield put(result);
    if (update.addUsers && update.addUsers.length) {
      yield call(notifySystemMessage, dialog.id, update.addUsers, NOTIFICATION_TYPE_ADDED);
    }
    if (resolve) {
      resolve(result);
    }
  } catch (e) {
    const result = dialogEditFail(e.message);
    yield put(result);
    if (reject) {
      reject(result);
    }
  }
}

export function* joinDialogs(action = {}) {
  try {
    const savedDialogs = yield select(({ dialogs }) => dialogs.dialogs);

    const joinToDialogs = [];
    for (const dialog of savedDialogs) {
      if (dialog.type === QB.chat.DIALOG_TYPE.GROUP_CHAT ||
        dialog.type === QB.chat.DIALOG_TYPE.PUBLIC_CHAT) {
        let dialogId = dialog.id
        const isJoined = yield call(QB.chat.isJoinedDialog, { dialogId });
        if (!isJoined) {
          joinToDialogs.push(dialog.id);
        }
      }
    }
    if (joinToDialogs.length) {
      yield put(dialogsJoin(joinToDialogs));
    }
  } catch (e) {
    showError('Failed to join dialogs', e.message);
    yield put(dialogsJoinFail(e.message));
  }
}

export function* joinDialog(action = {}) {
  try {
    const { dialogsIds } = action.payload;
    if (Array.isArray(dialogsIds) && dialogsIds.length) {
      const connected = yield select(({ chat }) => chat.connected);
      if (!connected) {
        yield take([CHAT_CONNECT_SUCCESS, QB.chat.EVENT_TYPE.CONNECTED]);
      }
      const dialogs = yield all(
        dialogsIds.map(dialogId => call(QB.chat.joinDialog, { dialogId })),
      );
      yield put(dialogsJoinSuccess(dialogs));
    } else {
      throw new Error('"dialogsIds" is not of type Array or empty');
    }
  } catch (e) {
    yield put(dialogsJoinFail(e.message));
  }
}

export function* leaveDialogs(action = {}) {
  const { dialogsIds, resolve, reject } = action.payload;
  try {
    const { dialogs, limit, currentUser } = yield select(state => ({
      dialogs: state.dialogs.dialogs,
      limit: state.dialogs.limit,
      currentUser: state.auth.user,
    }));
    yield all(
      dialogsIds.map(function* (dialogId) {
        const dialog = dialogs.find(item => item.id === dialogId);
        if (!dialog) {
          return;
        }
        if (dialog.type === QB.chat.DIALOG_TYPE.CHAT) {
          yield call(QB.chat.deleteDialog, { dialogId });
        } else if (dialog.type === QB.chat.DIALOG_TYPE.GROUP_CHAT) {
          yield call(QB.chat.updateDialog, {
            dialogId: dialogId,
            removeUsers: [parseInt(currentUser.id, 10)]
          });
        }
      }),
    );
    const result = dialogsLeaveSuccess(dialogsIds);
    yield put(result);
    yield put(dialogGet({ append: false, limit, skip: 0 }));
    if (resolve) {
      resolve(result);
    }
  } catch (e) {
    const result = dialogsLeaveFail(e.message);
    yield put(result);
    if (reject) {
      reject(result);
    }
  }
}

export function* sendIsTyping(action = {}) {
  try {
    const dialogId = action.payload;
    yield call(QB.chat.sendIsTyping, { dialogId });
    yield put(dialogStartTypingSuccess());
  } catch (e) {
    yield put(dialogStartTypingFail(e.message));
  }
}

export function* sendStoppedStyping(action = {}) {
  try {
    const dialogId = action.payload;
    yield call(QB.chat.sendStoppedTyping, { dialogId });
    yield put(dialogStopTypingSuccess());
  } catch (e) {
    yield put(dialogStopTypingFail(e.message));
  }
}

function* notifySystemMessage(dialogId, recipientIds, notification_type) {
  const { dialogs, user } = yield select(state => ({
    dialogs: state.dialogs.dialogs,
    user: state.auth.user,
  }));
  const dialog = dialogs.find(d => d.id === dialogId);
  if (dialog && dialog.type === QB.chat.DIALOG_TYPE.GROUP_CHAT) {
    for (const userId of recipientIds) {
      const message = {
        properties: {
          dialog_id: dialog.id,
          name: dialog.name,
          notification_type,
          occupants_ids: dialog.occupantsIds.join(),
          type: `${dialog.type}`,
          xmpp_room_jid: dialog.roomJid,
        },
        recipientId: userId,
      };
      yield put(messageSystemSend(message));
    }
  }
}

function* updateDialogLastMessage(action) {
  try {
    const { dialogId, messages, skip } = action.payload;
    if (skip === 0 && messages.length) {
      const dialog = yield select(({ dialogs }) =>
        dialogs.dialogs.find(d => d.id === dialogId),
      );
      if (dialog) {
        const [message] = messages;
        if (!message) {
          return;
        }
        if (message.body && message.body !== dialog.lastMessage) {
          yield put(dialogEditSuccess({ ...dialog, lastMessage: message.body }));
        } else {
          if (
            message.attachments &&
            message.attachments.length &&
            dialog.lastMessage !== 'Attachment'
          ) {
            yield put(
              dialogEditSuccess({ ...dialog, lastMessage: 'Attachment' }),
            );
          }
        }
      }
    }
  } catch (e) {
    showError('Failed to update dialog', e.message);
  }
}

export default [
  takeLeading([DIALOGS_GET_REQUEST, CHAT_CONNECT_SUCCESS, CHAT_RECONNECT_SUCCESS], getDialogs),
  takeLatest(DIALOGS_CREATE_REQUEST, createDialog),
  takeLatest(DIALOGS_EDIT_REQUEST, updateDialog),
  takeEvery(DIALOGS_JOIN_REQUEST, joinDialog),
  takeEvery(DIALOGS_LEAVE_REQUEST, leaveDialogs),
  takeLatest(DIALOGS_START_TYPING_REQUEST, sendIsTyping),
  takeLatest(DIALOGS_STOP_TYPING_REQUEST, sendStoppedStyping),
  takeEvery(MESSAGES_GET_SUCCESS, updateDialogLastMessage),
  takeLatest([CHAT_CONNECT_SUCCESS, CHAT_RECONNECT_SUCCESS], joinDialogs),
];
