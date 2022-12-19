import QB from 'quickblox-react-native-sdk';

import {
  AUTH_LOGOUT_SUCCESS,
  DIALOGS_CREATE_FAIL,
  DIALOGS_CREATE_REQUEST,
  DIALOGS_CREATE_SUCCESS,
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
  DIALOGS_SELECT,
  DIALOGS_SELECT_RESET,
  DIALOGS_ACTIVATE_DIALOG,
  DIALOGS_DEACTIVATE_DIALOG,
  DIALOGS_UPDATE_TYPING_STATUS,
  DIALOGS_JOIN_SUCCESS
} from '../constants';

const initialState = {
  dialogs: [],
  error: undefined,
  filter: '',
  limit: 15,
  loading: false,
  selected: [],
  skip: 0,
  total: 0,
  activeDialogId: undefined,
  dialogTyping: undefined,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case DIALOGS_SET_FILTER:
      return { ...state, filter: action.payload };
    case DIALOGS_GET_REQUEST:
    case DIALOGS_CREATE_REQUEST:
    case DIALOGS_EDIT_REQUEST:
    case DIALOGS_LEAVE_REQUEST:
      return { ...state, error: undefined, loading: true };
    case DIALOGS_GET_SUCCESS: {
      const { append, dialogs: newDialogs, limit, skip, total } = action.payload;
      if (append) {
        const dialogs = state.dialogs.slice();
        newDialogs.forEach(dialog => {
          const index = dialogs.findIndex(d => d.id === dialog.id);
          if (dialogs.some(d => d.id === dialog.id)) {
            dialogs[index] = { ...dialogs[index], ...dialog };
          } else {
            dialogs.unshift(dialog);
          }
        });
        dialogs.sort((a, b) => b.lastMessageDateSent - a.lastMessageDateSent);
        return {
          ...state,
          dialogs,
          limit,
          loading: false,
          skip,
          total,
        };
      } else {
        return {
          ...state,
          dialogs: newDialogs,
          limit,
          loading: false,
          skip,
          total,
        };
      }
    }
    case DIALOGS_CREATE_SUCCESS: {
      const dialogs = state.dialogs.slice();
      const index = dialogs.findIndex(
        dialog => dialog.id === action.payload.id,
      );
      if (index === -1) {
        dialogs.unshift(action.payload);
      } else {
        dialogs[index] = { ...dialogs[index], ...action.payload };
      }
      return { ...state, dialogs, loading: false };
    }
    case DIALOGS_EDIT_SUCCESS: {
      const dialogs = state.dialogs.slice();
      const index = dialogs.findIndex(
        dialog => dialog.id === action.payload.id,
      );
      if (index > -1) {
        dialogs[index] = { ...dialogs[index], ...action.payload };
      }
      dialogs.sort((a, b) => b.lastMessageDateSent - a.lastMessageDateSent);
      return { ...state, dialogs, loading: false };
    }
    case DIALOGS_LEAVE_SUCCESS: {
      const dialogsIds = action.payload;
      const dialogs = state.dialogs.filter(
        dialog => !dialogsIds.includes(dialog.id),
      );
      return { ...state, dialogs, error: undefined, loading: false };
    }
    case DIALOGS_GET_FAIL:
    case DIALOGS_CREATE_FAIL:
    case DIALOGS_EDIT_FAIL:
    case DIALOGS_LEAVE_FAIL:
      return { ...state, error: action.error, loading: false };
    case DIALOGS_UNREAD_COUNT_DECREMENT: {
      const dialogs = state.dialogs.slice();
      const index = dialogs.findIndex(
        dialog => dialog.id === action.payload.dialogId,
      );
      if (index > -1) {
        dialogs[index] = {
          ...dialogs[index],
          unreadMessagesCount: (dialogs[index].unreadMessagesCount || 1) - 1,
        };
      }
      return { ...state, dialogs };
    }
    case DIALOGS_SELECT: {
      const dialogId = action.payload;
      const selected = state.selected.slice();
      const index = state.selected.indexOf(dialogId);
      if (index > -1) {
        selected.splice(index, 1);
      } else {
        selected.push(dialogId);
      }
      return { ...state, selected };
    }
    case DIALOGS_SELECT_RESET:
      return { ...state, selected: initialState.selected };
    case DIALOGS_ACTIVATE_DIALOG: {
      const dialogId = action.payload;
      return { ...state, activeDialogId: dialogId };
    }
    case DIALOGS_DEACTIVATE_DIALOG:
      return {
        ...state,
        activeDialogId: initialState.activeDialogId,
        dialogTyping: initialState.dialogTyping,
      };

    case DIALOGS_UPDATE_TYPING_STATUS: {
      const { dialogId, userId, isTyping } = action.payload;
      const dialogs = state.dialogs.slice();
      if (!dialogs.some(dialog => dialog.id === dialogId)) {
        return state;
      }
      const dialogTyping = { userId: userId, isTyping: isTyping };
      return { ...state, dialogTyping };
    }

    case DIALOGS_JOIN_SUCCESS: {
      const { joinedDialogs } = action.payload;
      const dialogs = state.dialogs.slice();
      joinedDialogs.forEach(joinedDialog => {
        const index = dialogs.findIndex(d => d.id === joinedDialog.id);
        if (dialogs.some(d => d.id === joinedDialog.id)) {
          if (index > -1) {
            dialogs[index] = {
              ...dialogs[index],
              isJoined: true,
            };
          }
        }
      });
      return { ...state, dialogs };
    }

    case AUTH_LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
