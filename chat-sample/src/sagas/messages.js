import { call, put, takeEvery } from 'redux-saga/effects'
import QB from 'quickblox-react-native-sdk'

import {
  dialogUnreadCountDecrement,
  messageMarkDeliveredFail,
  messageMarkDeliveredSuccess,
  messageMarkReadFail,
  messageMarkReadSuccess,
  messageSendFail,
  messageSendSuccess,
  messagesGetFail,
  messagesGetSuccess,
  messageSystemSendFail,
  messageSystemSendSuccess,
} from '../actionCreators'
import {
  MESSAGES_MARK_DELIVERED_REQUEST,
  MESSAGES_MARK_READ_REQUEST,
  MESSAGES_SEND_REQUEST,
  MESSAGES_GET_REQUEST,
  MESSAGES_SYSTEM_SEND_REQUEST,
} from '../constants'
import { showError } from '../NotificationService'

const MESSAGES_SORT = {
  ascending: false,
  field: QB.chat.MESSAGES_SORT.FIELD.DATE_SENT,
}

// since messages are sent with "markable: true" -
// SDK will mark messages as delivered for us
export function* markAsDelivered(action = {}) {
  try {
    yield call(QB.chat.markMessageDelivered, action.payload)
    yield put(messageMarkDeliveredSuccess())
  } catch(e) {
    yield put(messageMarkDeliveredFail(e.message))
  }
}

export function* markAsRead(action = {}) {
  try {
    const { message } = action.payload
    yield call(QB.chat.markMessageRead, action.payload)
    yield put(messageMarkReadSuccess())
    yield put(dialogUnreadCountDecrement({ dialogId: message.dialogId }))
  } catch(e) {
    yield put(messageMarkReadFail(e.message))
  }
}

export function* getMessages(action = {}) {
  try {
    const request = action.payload || {}
    const query = {
      dialogId: request.dialogId,
      limit: request.limit || 30,
      markAsRead: false,
      skip: request.skip || 0,
      sort: request.sort || MESSAGES_SORT,
    }
    const response = yield call(QB.chat.getDialogMessages, query)
    const result = messagesGetSuccess({
      messages: response.messages,
      hasMore: response.messages.length === response.limit
    })
    yield put(result)
    return result
  } catch (e) {
    showError('Failed to get messages', e.message)
    const result = messagesGetFail(e.message)
    yield put(result)
    return result
  }
}

export function* sendMessage(action = {}) {
  const { resolve, reject, ...message } = action.payload
  try {
    yield call(QB.chat.sendMessage, {
      ...message,
      saveToHistory: true
    })
    const result = messageSendSuccess()
    yield put(result)
    if (resolve) resolve(result)
  } catch (e) {
    const result = messageSendFail(e.message)
    yield put(result)
    if (reject) reject(result)
  }
}

export function* sendSystemMessage(action = {}) {
  try {
    yield call(QB.chat.sendSystemMessage, action.payload)
    yield put(messageSystemSendSuccess())
  } catch(e) {
    showError('Failed to send system message', e.message)
    const result = messageSystemSendFail(e.message)
    yield put(result)
    return result
  }
}

export default [
  takeEvery(MESSAGES_MARK_DELIVERED_REQUEST, markAsDelivered),
  takeEvery(MESSAGES_MARK_READ_REQUEST, markAsRead),
  takeEvery(MESSAGES_GET_REQUEST, getMessages),
  takeEvery(MESSAGES_SEND_REQUEST, sendMessage),
  takeEvery(MESSAGES_SYSTEM_SEND_REQUEST, sendSystemMessage),
]
