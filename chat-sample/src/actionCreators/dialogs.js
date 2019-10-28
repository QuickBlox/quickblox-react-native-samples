import {
  DIALOGS_CREATE_CANCEL,
  DIALOGS_CREATE_FAIL,
  DIALOGS_CREATE_REQUEST,
  DIALOGS_CREATE_SUCCESS,
  DIALOGS_DELETE_FAIL,
  DIALOGS_DELETE_REQUEST,
  DIALOGS_DELETE_SUCCESS,
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

export function dialogEdit({ dialogId, addUsers, removeUsers, name }) {
  return {
    type: DIALOGS_EDIT_REQUEST, payload: {
      dialogId,
      addUsers,
      removeUsers,
      name,
    }
  }
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

export function dialogJoin(dialogId) {
  return { type: DIALOGS_JOIN_REQUEST, payload: dialogId }
}

export function dialogJoinSuccess(payload) {
  return { type: DIALOGS_JOIN_SUCCESS, payload }
}

export function dialogJoinFail(error) {
  return { type: DIALOGS_JOIN_FAIL, error }
}

export function dialogLeave(dialogId) {
  return { type: DIALOGS_LEAVE_REQUEST, payload: dialogId }
}

export function dialogLeaveSuccess(dialogId) {
  return { type: DIALOGS_LEAVE_SUCCESS, payload: dialogId }
}

export function dialogLeaveFail(error) {
  return { type: DIALOGS_LEAVE_FAIL, error }
}

export function dialogDelete(dialogId) {
  return { type: DIALOGS_DELETE_REQUEST, payload: dialogId }
}

export function dialogDeleteSuccess(dialogId) {
  return { type: DIALOGS_DELETE_SUCCESS, payload: dialogId }
}

export function dialogDeleteFail(error) {
  return { type: DIALOGS_DELETE_FAIL, error }
}

export function dialogSelect(dialogId) {
  return { type: DIALOGS_SELECT, payload: dialogId }
}

export function dialogSelectReset() {
  return { type: DIALOGS_SELECT_RESET }
}