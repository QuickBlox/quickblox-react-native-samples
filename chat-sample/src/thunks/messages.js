import QB from 'quickblox-react-native-sdk'

import {
  dialogUnreadCountDecrement,
  messageMarkDelivered,
  messageMarkDeliveredFail,
  messageMarkDeliveredSuccess,
  messageMarkRead,
  messageMarkReadFail,
  messageMarkReadSuccess,
  messageSend,
  messageSendFail,
  messageSendSuccess,
  messagesGet,
  messagesGetFail,
  messagesGetSuccess,
  messageSystemSend,
  messageSystemSendFail,
  messageSystemSendSuccess,
} from '../actionCreators'
import { showError } from '../NotificationService'

const MESSAGES_SORT = {
  ascending: false,
  field: QB.chat.MESSAGES_SORT.FIELD.DATE_SENT,
}
const markAsReadQueue = {}

// since messages are sent with "markable: true" -
// SDK will mark messages as delivered for us
export const markAsDelivered = message => dispatch => {
  dispatch(messageMarkDelivered(message))
  return QB
    .chat
    .markMessageDelivered({ message })
    .then(() => dispatch(messageMarkDeliveredSuccess()))
    .catch(e => dispatch(messageMarkDeliveredFail(e.message)))
}

export const markAsRead = message => dispatch => {
  if (markAsReadQueue[message.id]) {
    return
  } else {
    markAsReadQueue[message.id] = true
  }
  dispatch(messageMarkRead(message))
  return QB
    .chat
    .markMessageRead({ message })
    .then(() => {
      dispatch(messageMarkReadSuccess())
      dispatch(dialogUnreadCountDecrement({ dialogId: message.dialogId }))
    })
    .catch(e => dispatch(messageMarkReadFail(e.message)))
    .finally(() => {
      markAsReadQueue[message.id] = false
    })
}

export const getMessages = request => dispatch => {
  const query = {
    dialogId: request.dialogId,
    limit: request.limit || 30,
    markAsRead: false,
    skip: request.skip || 0,
    sort: request.sort || MESSAGES_SORT,
  }
  dispatch(messagesGet(query))
  return QB
    .chat
    .getDialogMessages(query)
    .then(result => dispatch(messagesGetSuccess({
      messages: result.messages,
      hasMore: result.messages.length === result.limit
    })))
    .catch(e => {
      showError('Failed to get messages', e.message)
      return dispatch(messagesGetFail(e.message))
    })
}

export const sendMessage = (message) => dispatch => {
  dispatch(messageSend(message))
  return QB
    .chat
    .sendMessage({ ...message, saveToHistory: true })
    .then(() => dispatch(messageSendSuccess()))
    .catch(e => {
      showError('Failed to send message', e.message)
      return dispatch(messageSendFail(e.message))
    })
}

export const sendSystemMessage = message => dispatch => {
  dispatch(messageSystemSend(message))
  return QB
    .chat
    .sendSystemMessage(message)
    .then(() => dispatch(messageSystemSendSuccess()))
    .catch(e => {
      showError('Failed to send system message', e.message)
      return dispatch(messageSystemSendFail(e.message))
    })
}