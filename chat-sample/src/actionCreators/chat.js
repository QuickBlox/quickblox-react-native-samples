import {
  CHAT_CONNECT_AND_SUBSCRIBE,
  CHAT_CONNECT_FAIL,
  CHAT_CONNECT_REQUEST,
  CHAT_CONNECT_SUCCESS,
  CHAT_DISCONNECT_FAIL,
  CHAT_DISCONNECT_REQUEST,
  CHAT_DISCONNECT_SUCCESS,
  CHAT_IS_CONNECTED_FAIL,
  CHAT_IS_CONNECTED_REQUEST,
  CHAT_IS_CONNECTED_SUCCESS,
  CHAT_RECONNECT_SUCCESS,
} from '../constants';

export function chatIsConnected() {
  return {type: CHAT_IS_CONNECTED_REQUEST};
}

export function chatIsConnectedSuccess(isConnected) {
  return {payload: isConnected, type: CHAT_IS_CONNECTED_SUCCESS};
}

export function chatIsConnectedFail(error) {
  return {error, type: CHAT_IS_CONNECTED_FAIL};
}

export function chatConnectAndSubscribe() {
  return {type: CHAT_CONNECT_AND_SUBSCRIBE};
}

export function chatConnect({password, userId}) {
  return {
    payload: {password, userId},
    type: CHAT_CONNECT_REQUEST,
  };
}

export function chatConnectSuccess() {
  return {type: CHAT_CONNECT_SUCCESS};
}

export function chatConnectFail(error) {
  return {error, type: CHAT_CONNECT_FAIL};
}

export function chatDisconnect() {
  return {type: CHAT_DISCONNECT_REQUEST};
}

export function chatDisconnectSuccess() {
  return {type: CHAT_DISCONNECT_SUCCESS};
}

export function chatDisconnectFail(error) {
  return {error, type: CHAT_DISCONNECT_FAIL};
}

export function chatReconnectSuccess() {
  return {type: CHAT_RECONNECT_SUCCESS};
}
