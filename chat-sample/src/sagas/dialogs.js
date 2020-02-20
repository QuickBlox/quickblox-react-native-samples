import {
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects'
import QB from 'quickblox-react-native-sdk'

import {
  dialogCreateFail,
  dialogCreateSuccess,
  dialogEditFail,
  dialogEditSuccess,
  dialogGet,
  dialogGetFail,
  dialogGetSuccess,
  dialogJoin,
  dialogJoinFail,
  dialogJoinSuccess,
  dialogLeaveFail,
  dialogLeaveSuccess,
  dialogStartTypingFail,
  dialogStartTypingSuccess,
  dialogStopTypingFail,
  dialogStopTypingSuccess,
  messageSend,
  messageSystemSend,
} from '../actionCreators'
import {
  DIALOGS_CREATE_REQUEST,
  DIALOGS_EDIT_REQUEST,
  DIALOGS_GET_REQUEST,
  DIALOGS_JOIN_REQUEST,
  DIALOGS_LEAVE_REQUEST,
  DIALOGS_START_TYPING_REQUEST,
  DIALOGS_STOP_TYPING_REQUEST,
} from '../constants'
import { showError } from '../NotificationService'

const backgroundColors = [
  '#53c6a2',
  '#fdd762',
  '#9261d3',
  '#43dce7',
  '#ffcc5a',
  '#ea4398',
  '#4a5de1',
  '#e95555',
  '#7eda54',
  '#f9b647',
]
const getRandomColor = () => {
  return backgroundColors[backgroundColors.length * Math.random() | 0]
}

export function* getDialogs(action = {}) {
  try {
    const { append, ...params  } = action.payload || {}
    const savedDialogs = yield select(({ dialogs }) => dialogs.dialogs)
    const response = yield call(QB.chat.getDialogs, params)
    const joinToDialogs = []
    for (const dialog of response.dialogs) {
      if (!dialog.isJoined) {
        joinToDialogs.push(dialog.id)
      }
      const savedDialog = savedDialogs.find(d => d.id === dialog.id)
      if (savedDialog && savedDialog.color) {
        dialog.color = savedDialog.color
      } else {
        dialog.color = getRandomColor()
      }
    }
    yield put(dialogGetSuccess({ ...response, append }))
    while (joinToDialogs.length) {
      const dialogId = joinToDialogs.pop()
      yield put(dialogJoin(dialogId))
    }
  } catch (e) {
    showError('Failed to get dialogs', e.message)
    yield put(dialogGetFail(e.message))
  }
}

export function* createDialog(action = {}) {
  const { resolve, reject, ...data } = action.payload
  try {
    const dialog = yield call(QB.chat.createDialog, data)
    dialog.color = getRandomColor()
    const result = dialogCreateSuccess(dialog)
    yield put(result)
    yield call(notifySystemMessage, dialog.id, '1')
    if (resolve) resolve(result)
  } catch (e) {
    const result = dialogCreateFail(e.message)
    yield put(result)
    if (reject) reject(result)
  }
}

export function* updateDialog(action = {}) {
  const { resolve, reject, ...update } = action.payload
  try {
    if (update.removeUsers && update.removeUsers.length) {
      yield call(notifySystemMessage, update.dialogId, '3')
    }
    const dialog = yield call(QB.chat.updateDialog, update)
    const result = dialogEditSuccess(dialog)
    yield put(result)
    if (update.addUsers && update.addUsers.length) {
      yield call(notifySystemMessage, dialog.id, '2')
    }
    if (resolve) resolve(result)
  } catch (e) {
    const result = dialogEditFail(e.message)
    yield put(result)
    if (reject) reject(result)
  }
}

export function* joinDialog(action = {}) {
  try {
    const dialogId = action.payload
    const dialog = yield call(QB.chat.joinDialog, { dialogId })
    yield put(dialogJoinSuccess(dialog))
  } catch(e) {
    yield put(dialogJoinFail(e.message))
  }
}

export function* leaveDialog(action = {}) {
  const { dialogId, resolve, reject } = action.payload
  try {
    const { dialogs, user } = yield select(({ auth, dialogs }) => ({
      dialogs: dialogs.dialogs,
      user: auth.user,
    }))
    const dialog = dialogs.find(item => item.id === dialogId)
    if (dialog && dialog.type === QB.chat.DIALOG_TYPE.GROUP_CHAT) {
      const myName = user.fullName || user.login || user.email
      const body = `${myName} left the dialog`
      yield put(messageSend({
        dialogId,
        body,
        properties: { notification_type: 3 }
      }))
    }
    yield call(QB.chat.leaveDialog, { dialogId })
    yield call(notifySystemMessage, dialogId, '3')
    const result = dialogLeaveSuccess(dialogId)
    yield put(result)
    yield put(dialogGet())
    if (resolve) resolve(result)
  } catch (e) {
    const result = dialogLeaveFail(e.message)
    yield put(result)
    if (reject) reject(result)
  }
}

export function* sendIsTyping(action = {}) {
  try {
    const dialogId = action.payload
    yield call(QB.chat.sendIsTyping, { dialogId })
    yield put(dialogStartTypingSuccess())
  } catch (e) {
    yield put(dialogStartTypingFail(e.message))
  }
}

export function* sendStoppedStyping(action = {}) {
  try {
    const dialogId = action.payload
    yield call(QB.chat.sendStoppedTyping, { dialogId })
    yield put(dialogStopTypingSuccess())
  } catch (e) {
    yield put(dialogStopTypingFail(e.message))
  }
}

function* notifySystemMessage(dialogId, notification_type) {
  const { dialogs, user } = yield select(({ auth, dialogs }) => ({
    dialogs: dialogs.dialogs,
    user: auth.user,
  }))
  const dialog = dialogs.find(dialog => dialog.id === dialogId)
  if (dialog && dialog.type !== QB.chat.DIALOG_TYPE.PUBLIC_CHAT) {
    const { occupantsIds = [] } = dialog
    const userIds = occupantsIds.filter(id => id !== user.id)
    for (const userId of userIds) {
        const message = {
          recipientId: userId,
          properties: {
            xmpp_room_jid: dialog.roomJid,
            name: dialog.name,
            dialog_id: dialog.id,
            type: `${dialog.type}`,
            occupants_ids: dialog.occupantsIds.join(),
            notification_type
          }
        }
        yield put(messageSystemSend(message))
    }
  }
}

export default [
  takeEvery(DIALOGS_GET_REQUEST, getDialogs),
  takeLatest(DIALOGS_CREATE_REQUEST, createDialog),
  takeLatest(DIALOGS_EDIT_REQUEST, updateDialog),
  takeEvery(DIALOGS_JOIN_REQUEST, joinDialog),
  takeEvery(DIALOGS_LEAVE_REQUEST, leaveDialog),
  takeLatest(DIALOGS_START_TYPING_REQUEST, sendIsTyping),
  takeLatest(DIALOGS_STOP_TYPING_REQUEST, sendStoppedStyping),
]
