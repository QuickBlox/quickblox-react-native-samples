import {
  CHAT_CONNECT_FAIL,
  CHAT_CONNECT_REQUEST,
  CHAT_CONNECT_SUCCESS,
  CHAT_DISCONNECT_FAIL,
  CHAT_DISCONNECT_REQUEST,
  CHAT_DISCONNECT_SUCCESS,
  CHAT_IS_CONNECTED_FAIL,
  CHAT_IS_CONNECTED_REQUEST,
  CHAT_IS_CONNECTED_SUCCESS,
  CHAT_PING_SERVER_FAIL,
  CHAT_PING_SERVER_REQUEST,
  CHAT_PING_SERVER_SUCCESS,
  CHAT_PING_USER_FAIL,
  CHAT_PING_USER_REQUEST,
  CHAT_PING_USER_SUCCESS,
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

export function chatPingServer() {
  return { type: CHAT_PING_SERVER_REQUEST }
}

export function chatPingServerSuccess(data) {
  return { type: CHAT_PING_SERVER_SUCCESS, payload: data }
}

export function chatPingServerFail(error) {
  return { type: CHAT_PING_SERVER_FAIL, error }
}

export function chatPingUser(userId) {
  return { type: CHAT_PING_USER_REQUEST, payload: userId }
}

export function chatPingUserSuccess(data) {
  return { type: CHAT_PING_USER_SUCCESS, payload: data }
}

export function chatPingUserFail(error) {
  return { type: CHAT_PING_USER_FAIL, error }
}