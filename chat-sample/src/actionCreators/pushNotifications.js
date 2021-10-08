import {
  CREATE_PUSH_SUBSCRIPTIONS,
  DEVICE_UDID_REMOVE,
  DEVICE_UDID_SET,
  PUSH_TOKEN_REMOVE,
  PUSH_TOKEN_SET,
  REMOVE_PUSH_SUBSCRIPTIONS,
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

export function createSubscriptions() {
  return {type: CREATE_PUSH_SUBSCRIPTIONS};
}

export function removePushSubscriptions(params) {
  return {payload: params, type: REMOVE_PUSH_SUBSCRIPTIONS};
}
