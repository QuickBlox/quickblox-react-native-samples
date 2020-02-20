import QB from 'quickblox-react-native-sdk'

import {
  AUTH_LOGOUT_SUCCESS,
  DIALOGS_LEAVE_SUCCESS,
  MESSAGES_GET_FAIL,
  MESSAGES_GET_REQUEST,
  MESSAGES_GET_SUCCESS,
  MESSAGES_SEND_FAIL,
  MESSAGES_SEND_REQUEST,
  MESSAGES_SEND_SUCCESS,
  FILE_UPLOAD_REQUEST,
  FILE_UPLOAD_SUCCESS,
  FILE_UPLOAD_FAIL,
} from '../constants'

const initialState = {
  error: undefined,
  loading: false,
  messages: {},
  sending: false,
}

export default (state = initialState, action) => {
  let dialogMessages
  let index = -1
  switch (action.type) {
    case MESSAGES_GET_REQUEST:
      return { ...state, error: undefined, loading: true }
    case MESSAGES_GET_SUCCESS: {
      const messages = Object.assign({}, state.messages)
      action.payload.messages.forEach((message, i) => {
        if (!messages[message.dialogId]) {
          messages[message.dialogId] = []
        }
        index = messages[message.dialogId].findIndex(msg =>
          msg.id === message.id
        )
        if (index > -1) {
          messages[message.dialogId].splice(index, 1, message)
        } else {
          messages[message.dialogId].push(message)
        }
        if (i === action.payload.messages.length - 1) {
          messages[message.dialogId].hasMore = action.payload.hasMore
        }
      })
      return { ...state, loading: false, messages }
    }
    case MESSAGES_GET_FAIL:
      return { ...state, error: action.error, loading: false }
    case DIALOGS_LEAVE_SUCCESS: {
      const messages = { ...state.messages }
      messages[action.payload] = []
      return { ...state, messages }
    }
    case MESSAGES_SEND_REQUEST:
      return { ...state, error: undefined, sending: true }
    case MESSAGES_SEND_SUCCESS:
      return { ...state, sending: false }
    case MESSAGES_SEND_FAIL:
      return { ...state, error: action.error, sending: false }
    case QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE: {
      dialogMessages = (state.messages[action.payload.dialogId] || []).slice()
      index = dialogMessages.findIndex(message =>
        message.id === action.payload.id
      )
      if (index === -1) {
        dialogMessages.push(action.payload)
      }
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.dialogId]: dialogMessages
        }
      }
    }
    case QB.chat.EVENT_TYPE.MESSAGE_DELIVERED: {
      dialogMessages = (state.messages[action.payload.dialogId] || []).slice()
      index = dialogMessages.findIndex(message =>
        message.id === action.payload.messageId
      )
      if (index > -1) {
        if (!dialogMessages[index].deliveredIds) {
          dialogMessages[index].deliveredIds = []
        }
        dialogMessages[index].deliveredIds.push(action.payload.userId)
      }
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.dialogId]: dialogMessages
        }
      }
    }
    case QB.chat.EVENT_TYPE.MESSAGE_READ: {
      dialogMessages = (state.messages[action.payload.dialogId] || []).slice()
      index = dialogMessages.findIndex(message =>
        message.id === action.payload.messageId
      )
      if (index > -1) {
        if (!dialogMessages[index].readIds) {
          dialogMessages[index].readIds = []
        }
        dialogMessages[index].readIds.push(action.payload.userId)
        if (!dialogMessages[index].deliveredIds) {
          dialogMessages[index].deliveredIds = [action.payload.userId]
        } else {
          if (dialogMessages[index].deliveredIds.indexOf(action.payload.userId) === -1) {
            dialogMessages[index].deliveredIds.push(action.payload.userId)
          }
        }
      }
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.dialogId]: dialogMessages
        }
      }
    }
    case AUTH_LOGOUT_SUCCESS: return initialState
    default: return state
  }
}