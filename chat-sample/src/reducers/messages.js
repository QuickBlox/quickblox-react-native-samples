import QB from 'quickblox-react-native-sdk';

import {
  AUTH_LOGOUT_SUCCESS,
  DIALOGS_LEAVE_SUCCESS,
  MESSAGES_GET_FAIL,
  MESSAGES_GET_REQUEST,
  MESSAGES_GET_SUCCESS,
  MESSAGES_SEND_FAIL,
  MESSAGES_SEND_REQUEST,
  MESSAGES_SEND_SUCCESS,
  MESSAGES_SYSTEM_SEND_FAIL,
  MESSAGES_MARK_READ_SUCCESS,
  MESSAGES_SYSTEM_SEND_REQUEST,
  MESSAGES_SYSTEM_SEND_SUCCESS,
  RECEIVED_NEW_MESSAGE,
} from '../constants';

const initialState = {
  error: undefined,
  loading: false,
  messages: {
    allIds: [],
    byDialogId: {},
    byId: {},
  },
  sending: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case MESSAGES_GET_REQUEST:
      return {...state, error: undefined, loading: true};
    case MESSAGES_GET_SUCCESS: {
      const messages = Object.assign({}, state.messages);
      const idsSet = new Set(messages.allIds);
      action.payload.messages.forEach((message, i) => {
        idsSet.add(message.id);
        messages.byId[message.id] = message;
        if (!messages.byDialogId[message.dialogId]) {
          messages.byDialogId[message.dialogId] = {};
        }
        messages.byDialogId[message.dialogId][message.id] = message;
        if (i === action.payload.messages.length - 1) {
          messages.byDialogId[message.dialogId].hasMore =
            action.payload.hasMore;
        }
      });
      messages.allIds = Array.from(idsSet);
      return {...state, loading: false, messages};
    }
    case MESSAGES_GET_FAIL:
      return {...state, error: action.error, loading: false};
    case DIALOGS_LEAVE_SUCCESS: {
      const messages = Object.assign({}, state.messages);
      const idsSet = new Set(messages.allIds);
      const dialogId = action.payload;
      if (messages.byDialogId[dialogId]) {
        const messagesIdsForDialog = Object.keys(messages.byDialogId).filter(
          id => id !== 'hasMore',
        );
        messagesIdsForDialog.forEach(messageId => {
          idsSet.delete(messageId);
          delete messages.byId[messageId];
        });
        delete messages.byDialogId[dialogId];
        messages.allIds = Array.from(idsSet);
      }
      return {...state, messages};
    }
    case MESSAGES_SEND_REQUEST:
    case MESSAGES_SYSTEM_SEND_REQUEST:
      return {...state, error: undefined, sending: true};
    case MESSAGES_SEND_SUCCESS:
    case MESSAGES_SYSTEM_SEND_SUCCESS:
      return {...state, sending: false};
    case MESSAGES_SEND_FAIL:
    case MESSAGES_SYSTEM_SEND_FAIL:
      return {...state, error: action.error, sending: false};
    case RECEIVED_NEW_MESSAGE: {
      const messages = Object.assign({}, state.messages);
      const idsSet = new Set(messages.allIds);
      const message = action.payload;
      messages.byId[message.id] = message;
      if (!messages.byDialogId[message.dialogId]) {
        messages.byDialogId[message.dialogId] = {};
      }
      messages.byDialogId[message.dialogId][message.id] = message;
      idsSet.add(message.id);
      messages.allIds = Array.from(idsSet);
      return {...state, messages: messages};
    }
    case QB.chat.EVENT_TYPE.MESSAGE_DELIVERED: {
      const byDialogId = {...state.messages.byDialogId};
      const byId = {...state.messages.byId};
      const {dialogId, messageId, userId} = action.payload;
      if (dialogId in byDialogId) {
        let message = {...byDialogId[dialogId][messageId]};
        if (Array.isArray(message.deliveredIds)) {
          if (!message.deliveredIds.includes(userId)) {
            message = {
              ...message,
              deliveredIds: message.deliveredIds.concat(userId),
            };
          }
        } else {
          message = {...message, deliveredIds: [userId]};
        }
        byDialogId[dialogId][messageId] = message;
        byId[messageId] = message;
      }
      return {...state, messages: {...state.messages, byDialogId, byId}};
    }
    case MESSAGES_MARK_READ_SUCCESS:
    case QB.chat.EVENT_TYPE.MESSAGE_READ: {
      const byDialogId = {...state.messages.byDialogId};
      const byId = {...state.messages.byId};
      const {dialogId, messageId, userId} = action.payload;
      if (dialogId in byDialogId) {
        let message = {...byDialogId[dialogId][messageId]};
        if (Array.isArray(message.readIds)) {
          if (!message.readIds.includes(userId)) {
            message = {
              ...message,
              readIds: message.readIds.concat(userId),
            };
          }
        } else {
          message = {...message, readIds: [userId]};
        }
        if (Array.isArray(message.deliveredIds)) {
          if (!message.deliveredIds.includes(userId)) {
            message = {
              ...message,
              deliveredIds: message.deliveredIds.concat(userId),
            };
          }
        } else {
          message = {...message, deliveredIds: [userId]};
        }
        byDialogId[dialogId][messageId] = message;
        byId[messageId] = message;
      }
      return {...state, messages: {...state.messages, byDialogId, byId}};
    }
    case AUTH_LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
