import {
  DIALOGS_CREATE_CANCEL,
  DIALOGS_CREATE_FAIL,
  DIALOGS_CREATE_REQUEST,
  DIALOGS_CREATE_SUCCESS,
  DIALOGS_EDIT_CANCEL,
  DIALOGS_EDIT_FAIL,
  DIALOGS_EDIT_REQUEST,
  DIALOGS_EDIT_SUCCESS,
  DIALOGS_GET_FAIL,
  DIALOGS_GET_REQUEST,
  DIALOGS_GET_SUCCESS,
  DIALOGS_JOIN_FAIL,
  DIALOGS_JOIN_REQUEST,
  DIALOGS_JOIN_SUCCESS,
  DIALOGS_LEAVE_FAIL,
  DIALOGS_LEAVE_REQUEST,
  DIALOGS_LEAVE_SUCCESS,
  DIALOGS_SELECT_RESET,
  DIALOGS_SELECT,
  DIALOGS_ACTIVATE_DIALOG,
  DIALOGS_DEACTIVATE_DIALOG,
  DIALOGS_SET_FILTER,
  DIALOGS_START_TYPING_FAIL,
  DIALOGS_START_TYPING_REQUEST,
  DIALOGS_START_TYPING_SUCCESS,
  DIALOGS_STOP_TYPING_FAIL,
  DIALOGS_STOP_TYPING_REQUEST,
  DIALOGS_STOP_TYPING_SUCCESS,
  DIALOGS_UNREAD_COUNT_DECREMENT,
  DIALOGS_UNREAD_COUNT_INCREMENT,
  DIALOGS_UPDATE_TYPING_STATUS
} from '../constants';

export function dialogGet(params) {
  return {payload: params, type: DIALOGS_GET_REQUEST};
}

export function dialogGetSuccess(dialogs) {
  return {payload: dialogs, type: DIALOGS_GET_SUCCESS};
}

export function dialogGetFail(error) {
  return {error, type: DIALOGS_GET_FAIL};
}

export function dialogSetFilter(filter) {
  return {payload: filter, type: DIALOGS_SET_FILTER};
}

export function dialogUnreadCountDecrement(payload) {
  return {payload, type: DIALOGS_UNREAD_COUNT_DECREMENT};
}

export function dialogUnreadCountIncrement(payload) {
  return {payload, type: DIALOGS_UNREAD_COUNT_INCREMENT};
}

export function dialogCreate(params) {
  return {payload: params, type: DIALOGS_CREATE_REQUEST};
}

export function dialogCreateSuccess(dialog) {
  return {payload: dialog, type: DIALOGS_CREATE_SUCCESS};
}

export function dialogCreateFail(error) {
  return {error, type: DIALOGS_CREATE_FAIL};
}

export function dialogCreateCancel() {
  return {type: DIALOGS_CREATE_CANCEL};
}

export function dialogEdit(payload) {
  return {payload, type: DIALOGS_EDIT_REQUEST};
}

export function dialogEditSuccess(dialog) {
  return {payload: dialog, type: DIALOGS_EDIT_SUCCESS};
}

export function dialogEditFail(error) {
  return {error, type: DIALOGS_EDIT_FAIL};
}

export function dialogEditCancel() {
  return {type: DIALOGS_EDIT_CANCEL};
}

export function dialogsJoin(dialogsIds) {
  return {payload: {dialogsIds}, type: DIALOGS_JOIN_REQUEST};
}

export function dialogsJoinSuccess(payload) {
  return {payload, type: DIALOGS_JOIN_SUCCESS};
}

export function dialogsJoinFail(error) {
  return {error, type: DIALOGS_JOIN_FAIL};
}

export function dialogsLeave(payload) {
  return {payload, type: DIALOGS_LEAVE_REQUEST};
}

export function dialogsLeaveSuccess(dialogsIds) {
  return {payload: dialogsIds, type: DIALOGS_LEAVE_SUCCESS};
}

export function dialogsLeaveFail(error) {
  return {error, type: DIALOGS_LEAVE_FAIL};
}

export function dialogSelect(dialogId) {
  return {payload: dialogId, type: DIALOGS_SELECT};
}

export function dialogSelectReset() {
  return {type: DIALOGS_SELECT_RESET};
}

export function dialogActivate(dialogId) {
  return {payload: dialogId, type: DIALOGS_ACTIVATE_DIALOG};
}

export function dialogDeactivate() {
  return {type: DIALOGS_DEACTIVATE_DIALOG};
}

export function dialogStartTyping(dialogId) {
  return {payload: dialogId, type: DIALOGS_START_TYPING_REQUEST};
}

export function dialogStartTypingSuccess() {
  return {type: DIALOGS_START_TYPING_SUCCESS};
}

export function dialogStartTypingFail(error) {
  return {error, type: DIALOGS_START_TYPING_FAIL};
}

export function dialogStopTyping(dialogId) {
  return {payload: dialogId, type: DIALOGS_STOP_TYPING_REQUEST};
}

export function dialogStopTypingSuccess() {
  return {type: DIALOGS_STOP_TYPING_SUCCESS};
}

export function dialogStopTypingFail(error) {
  return {error, type: DIALOGS_STOP_TYPING_FAIL};
}

export function dialogUpdateTypingStatus(payload) {
  return {payload, type: DIALOGS_UPDATE_TYPING_STATUS};
}