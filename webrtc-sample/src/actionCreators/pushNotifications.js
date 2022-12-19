import {
  DEVICE_UDID_REMOVE,
  DEVICE_UDID_SET,
  PUSH_NOTIFICATION_CREATE_FAIL,
  PUSH_NOTIFICATION_CREATE_SUCCESS,
  PUSH_TOKEN_REMOVE,
  PUSH_TOKEN_SET,
} from '../constants';

export function saveUdid(udid) {
  return {payload: udid, type: DEVICE_UDID_SET};
}

export function removeUdid() {
  return {type: DEVICE_UDID_REMOVE};
}

export function saveToken(token) {
  return {payload: token, type: PUSH_TOKEN_SET};
}

export function removeToken() {
  return {type: PUSH_TOKEN_REMOVE};
}

export function pushNotificationCreateSuccess(payload) {
  return {type: PUSH_NOTIFICATION_CREATE_SUCCESS, payload};
}

export function pushNotificationCreateFail(error) {
  return {type: PUSH_NOTIFICATION_CREATE_FAIL, error};
}
