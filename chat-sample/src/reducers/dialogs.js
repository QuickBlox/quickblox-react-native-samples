import QB from 'quickblox-react-native-sdk'

import {
  AUTH_LOGOUT_SUCCESS,
  DIALOGS_CREATE_FAIL,
  DIALOGS_CREATE_REQUEST,
  DIALOGS_CREATE_SUCCESS,
  DIALOGS_DELETE_FAIL,
  DIALOGS_DELETE_REQUEST,
  DIALOGS_DELETE_SUCCESS,
  DIALOGS_EDIT_FAIL,
  DIALOGS_EDIT_REQUEST,
  DIALOGS_EDIT_SUCCESS,
  DIALOGS_GET_FAIL,
  DIALOGS_GET_REQUEST,
  DIALOGS_GET_SUCCESS,
  DIALOGS_LEAVE_FAIL,
  DIALOGS_LEAVE_REQUEST,
  DIALOGS_LEAVE_SUCCESS,
  DIALOGS_SET_FILTER,
  DIALOGS_UNREAD_COUNT_DECREMENT,
  DIALOGS_UNREAD_COUNT_INCREMENT,
  DIALOGS_SELECT,
  DIALOGS_SELECT_RESET,
} from '../constants'

const initialState = {
  dialogs: [],
  error: undefined,
  filter: '',
  limit: 30,
  loading: false,
  selected: [],
  skip: 0,
  total: 0,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case DIALOGS_SET_FILTER: return { ...state, filter: action.payload }
    case DIALOGS_GET_REQUEST:
    case DIALOGS_CREATE_REQUEST:
    case DIALOGS_EDIT_REQUEST:
    case DIALOGS_LEAVE_REQUEST:
    case DIALOGS_DELETE_REQUEST:
      return { ...state, error: undefined, loading: true }
    case DIALOGS_GET_SUCCESS: {
      const {
        append,
        dialogs: newDialogs,
        limit,
        skip,
        total,
      } = action.payload
      if (append) {
        const dialogs = state.dialogs.slice()
        newDialogs.forEach(dialog => {
          index = dialogs.findIndex(d => d.id === dialog.id)
          if (index === -1) {
            dialogs.push(dialog)
          } else {
            dialogs[index] = { ...dialogs[index], ...dialog }
          }
        })
        return {
          ...state,
          dialogs,
          limit,
          loading: false,
          skip,
          total,
        }
      } else {
        return {
          ...state,
          dialogs: newDialogs,
          limit,
          loading: false,
          skip,
          total,
        }
      }
    }
    case DIALOGS_CREATE_SUCCESS: {
      const dialogs = state.dialogs.slice()
      const index = dialogs.findIndex(dialog =>
        dialog.id === action.payload.id
      )
      if (index === -1) {
        dialogs.push(action.payload)
      } else {
        dialogs[index] = { ...dialogs[index], ...action.payload }
      }
      return { ...state, dialogs, loading: false }
    }
    case DIALOGS_EDIT_SUCCESS: {
      const dialogs = state.dialogs.slice()
      const index = dialogs.findIndex(dialog =>
        dialog.id === action.payload.id
      )
      if (index > -1) {
        dialogs[index] = { ...dialogs[index], ...action.payload }
      }
      return { ...state, dialogs, loading: false }
    }
    case DIALOGS_LEAVE_SUCCESS:
    case DIALOGS_DELETE_SUCCESS: {
      const dialogId = action.payload
      const dialogs = state.dialogs.slice()
      const index = dialogs.findIndex(dialog => dialog.id === dialogId)
      if (index > -1) {
        dialogs.splice(index, 1)
      }
      return { ...state, dialogs, error: undefined, loading: false }
    }
    case DIALOGS_GET_FAIL:
    case DIALOGS_CREATE_FAIL:
    case DIALOGS_EDIT_FAIL:
    case DIALOGS_LEAVE_FAIL:
    case DIALOGS_DELETE_FAIL:
      return { ...state, error: action.error, loading: false }
    case DIALOGS_UNREAD_COUNT_INCREMENT: {
      const dialogs = state.dialogs.slice()
      const index = dialogs.findIndex(dialog =>
        dialog.id === action.payload.dialogId
      )
      if (index > -1) {
        dialogs[index] = {
          ...dialogs[index],
          unreadMessagesCount: (dialogs[index].unreadMessagesCount || 0) + 1
        }
      }
      return { ...state, dialogs }
    }
    case DIALOGS_UNREAD_COUNT_DECREMENT: {
      const dialogs = state.dialogs.slice()
      const index = dialogs.findIndex(dialog =>
        dialog.id === action.payload.dialogId
      )
      if (index > -1) {
        dialogs[index] = {
          ...dialogs[index],
          unreadMessagesCount: (dialogs[index].unreadMessagesCount || 1) - 1
        }
      }
      return { ...state, dialogs }
    }
    case DIALOGS_SELECT: {
      const dialogId = action.payload
      const selected = state.selected.slice()
      const index = state.selected.indexOf(dialogId)
      if (index > -1) {
        selected.splice(index, 1)
      } else {
        selected.push(dialogId)
      }
      return { ...state, selected }
    }
    case DIALOGS_SELECT_RESET: {
      return { ...state, selected: initialState.selected }
    }
    case QB.chat.EVENT_TYPE.USER_IS_TYPING: {
      const dialogs = state.dialogs.slice()
      const index = dialogs.findIndex(dialog =>
        dialog.id === action.payload.dialogId
      )
      if (index === -1) {
        return state
      }
      const dialog = dialogs[index]
      if (!dialog.typing) {
        dialogs[index] = { ...dialog, typing: [action.payload.userId] }
      } else {
        const { userId } = action.payload
        dialogs[index] = {
          ...dialog,
          typing: dialog.typing.indexOf(userId) > -1 ?
            dialog.typing :
            dialog.typing.concat(action.payload.userId)
        }
      }
      return { ...state, dialogs }
    }
    case QB.chat.EVENT_TYPE.USER_STOPPED_TYPING: {
      const dialogs = state.dialogs.slice()
      const index = dialogs.findIndex(dialog =>
        dialog.id === action.payload.dialogId
      )
      if (index > -1) {
        const dialog = dialogs[index]
        dialogs[index] = {
          ...dialog,
          typing: dialog.typing ?
            dialog.typing.filter(id => id !== action.payload.userId) :
            []
        }
      }
      return { ...state, dialogs }
    }
    case AUTH_LOGOUT_SUCCESS: return initialState
    default: return state
  }
}