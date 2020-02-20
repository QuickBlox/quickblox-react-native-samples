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
} from '../constants'

export function chatIsConnected() {
  return { type: CHAT_IS_CONNECTED_REQUEST }
}

export function chatIsConnectedSuccess(isConnected) {
  return { type: CHAT_IS_CONNECTED_SUCCESS, payload: isConnected }
}

export function chatIsConnectedFail(error) {
  return { type: CHAT_IS_CONNECTED_FAIL, error }
}

export function chatConnectAndSubscribe() {
  return { type: CHAT_CONNECT_AND_SUBSCRIBE }
}

export function chatConnect({ userId, password }) {
  return {
    type: CHAT_CONNECT_REQUEST,
    payload: { userId, password }
  }
}

export function chatConnectSuccess() {
  return { type: CHAT_CONNECT_SUCCESS }
}

export function chatConnectFail(error) {
  return { type: CHAT_CONNECT_FAIL, error }
}

export function chatDisconnect() {
  return { type: CHAT_DISCONNECT_REQUEST }
}

export function chatDisconnectSuccess() {
  return { type: CHAT_DISCONNECT_SUCCESS }
}

export function chatDisconnectFail(error) {
  return { type: CHAT_DISCONNECT_FAIL, error }
}
