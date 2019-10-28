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
import { uploadFile } from './file'
import { showError } from '../NotificationService'

const MESSAGES_SORT = {
  ascending: false,
  field: QB.chat.MESSAGES_SORT.FIELD.DATE_SENT,
}
const markAsDeliveredQueue = {}
const markAsReadQueue = {}

export const markAsDelivered = ({ messageId, dialogId }) => dispatch => {
  if (markAsDeliveredQueue[messageId]) {
    return
  } else {
    markAsDeliveredQueue[messageId] = true
  }
  dispatch(messageMarkDelivered({ messageId, dialogId }))
  return QB
    .chat
    .markMessageDelivered({ messageId, dialogId })
    .then(() => dispatch(messageMarkDeliveredSuccess({ messageId, dialogId })))
    .catch(e => dispatch(messageMarkDeliveredFail(e.message)))
    .finally(() => {
      markAsDeliveredQueue[messageId] = false
    })
}

export const markAsRead = ({ messageId, dialogId }) => dispatch => {
  if (markAsReadQueue[messageId]) {
    return
  } else {
    markAsReadQueue[messageId] = true
  }
  dispatch(messageMarkRead({ messageId, dialogId }))
  return QB
    .chat
    .markMessageRead({ messageId, dialogId })
    .then(() => {
      dispatch(messageMarkReadSuccess({ messageId, dialogId }))
      dispatch(dialogUnreadCountDecrement({ dialogId }))
    })
    .catch(e => dispatch(messageMarkReadFail(e.message)))
    .finally(() => {
      markAsReadQueue[messageId] = false
    })
}

export const getMessages = (request) => (dispatch, getState) => {
  const { auth } = getState()
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
    .then(result => {
      dispatch(messagesGetSuccess({
        messages: result.messages,
        hasMore: result.messages.length === result.limit
      }))
      const notMarkedAsDelivered = result.messages.filter(({ deliveredIds }) =>
        deliveredIds && deliveredIds.indexOf(auth.user.id) < 0
      )
      if (notMarkedAsDelivered.length) {
        notMarkedAsDelivered.forEach(message =>
          dispatch(markAsDelivered({
            dialogId: message.dialogId,
            messageId: message.id,
          }))
        )
      }
    })
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