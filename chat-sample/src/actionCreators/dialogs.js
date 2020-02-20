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
  DIALOGS_SET_FILTER,
  DIALOGS_START_TYPING_FAIL,
  DIALOGS_START_TYPING_REQUEST,
  DIALOGS_START_TYPING_SUCCESS,
  DIALOGS_STOP_TYPING_FAIL,
  DIALOGS_STOP_TYPING_REQUEST,
  DIALOGS_STOP_TYPING_SUCCESS,
  DIALOGS_UNREAD_COUNT_DECREMENT,
  DIALOGS_UNREAD_COUNT_INCREMENT,
} from '../constants'

export function dialogGet(params) {
  return { type: DIALOGS_GET_REQUEST, payload: params }
}

export function dialogGetSuccess(dialogs) {
  return { type: DIALOGS_GET_SUCCESS, payload: dialogs }
}

export function dialogGetFail(error) {
  return { type: DIALOGS_GET_FAIL, error }
}

export function dialogSetFilter(filter) {
  return { type: DIALOGS_SET_FILTER, payload: filter }
}

export function dialogUnreadCountDecrement(payload) {
  return { type: DIALOGS_UNREAD_COUNT_DECREMENT, payload }
}

export function dialogUnreadCountIncrement(payload) {
  return { type: DIALOGS_UNREAD_COUNT_INCREMENT, payload }
}

export function dialogCreate(params) {
  return { type: DIALOGS_CREATE_REQUEST, payload: params }
}

export function dialogCreateSuccess(dialog) {
  return { type: DIALOGS_CREATE_SUCCESS, payload: dialog }
}

export function dialogCreateFail(error) {
  return { type: DIALOGS_CREATE_FAIL, error }
}

export function dialogCreateCancel() {
  return { type: DIALOGS_CREATE_CANCEL }
}

export function dialogEdit(payload) {
  return { type: DIALOGS_EDIT_REQUEST, payload }
}

export function dialogEditSuccess(dialog) {
  return { type: DIALOGS_EDIT_SUCCESS, payload: dialog }
}

export function dialogEditFail(error) {
  return { type: DIALOGS_EDIT_FAIL, error }
}

export function dialogEditCancel() {
  return { type: DIALOGS_EDIT_CANCEL }
}

export function dialogJoin(payload) {
  return { type: DIALOGS_JOIN_REQUEST, payload }
}

export function dialogJoinSuccess(payload) {
  return { type: DIALOGS_JOIN_SUCCESS, payload }
}

export function dialogJoinFail(error) {
  return { type: DIALOGS_JOIN_FAIL, error }
}

export function dialogLeave(payload) {
  return { type: DIALOGS_LEAVE_REQUEST, payload }
}

export function dialogLeaveSuccess(dialogId) {
  return { type: DIALOGS_LEAVE_SUCCESS, payload: dialogId }
}

export function dialogLeaveFail(error) {
  return { type: DIALOGS_LEAVE_FAIL, error }
}

export function dialogSelect(dialogId) {
  return { type: DIALOGS_SELECT, payload: dialogId }
}

export function dialogSelectReset() {
  return { type: DIALOGS_SELECT_RESET }
}

export function dialogStartTyping(dialogId) {
  return { type: DIALOGS_START_TYPING_REQUEST, payload: dialogId }
}

export function dialogStartTypingSuccess() {
  return { type: DIALOGS_START_TYPING_SUCCESS }
}

export function dialogStartTypingFail(error) {
  return { type: DIALOGS_START_TYPING_FAIL, error }
}

export function dialogStopTyping(dialogId) {
  return { type: DIALOGS_STOP_TYPING_REQUEST, payload: dialogId }
}

export function dialogStopTypingSuccess() {
  return { type: DIALOGS_STOP_TYPING_SUCCESS }
}

export function dialogStopTypingFail(error) {
  return { type: DIALOGS_STOP_TYPING_FAIL, error }
}
