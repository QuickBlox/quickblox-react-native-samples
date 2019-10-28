import QB from 'quickblox-react-native-sdk'

import { subscribe, unsubscribe } from './QBevents'
import {
  chatConnect,
  chatConnectFail,
  chatConnectSuccess,
  chatDisconnect,
  chatDisconnectFail,
  chatDisconnectSuccess,
  chatIsConnected,
  chatIsConnectedFail,
  chatIsConnectedSuccess,
  chatPingServer,
  chatPingServerFail,
  chatPingServerSuccess,
  chatPingUser,
  chatPingUserFail,
  chatPingUserSuccess,
} from '../actionCreators'
import { showError } from '../NotificationService'

export const isChatConnected = () => dispatch => {
  dispatch(chatIsConnected())
  return QB.chat
    .isConnected()
    .then(isConnected => dispatch(chatIsConnectedSuccess(isConnected)))
    .catch(e => dispatch(chatIsConnectedFail(e.message)))
}

export const chatConnectThunk = ({ userId, password }) => (dispatch) => {
  dispatch(chatConnect({ userId, password }))
  return QB.chat
    .connect({ userId, password })
    .then(() => dispatch(chatConnectSuccess()))
    .catch((e) => {
      showError('Failed to connect to chat', e.message)
      return dispatch(chatConnectFail(e.message))
    })
}

export const chatDisconnectThunk = () => (dispatch) => {
  dispatch(chatDisconnect())
  return QB.chat
    .disconnect()
    .then(() => dispatch(chatDisconnectSuccess()))
    .catch((e) => {
      showError('Failed to disconnect from chat', e.message)
      return dispatch(chatDisconnectFail(e.message))
    })
}

export const pingServer = () => dispatch => {
  dispatch(chatPingServer())
  return QB
    .chat
    .pingServer()
    .then(data => dispatch(chatPingServerSuccess(data)))
    .catch(e => dispatch(chatPingServerFail(e.message)))
}

export const pingUser = (userId = 93732090) => dispatch => {
  dispatch(chatPingUser(userId))
  return QB
    .chat
    .pingUser({ userId })
    .then(data => dispatch(chatPingUserSuccess(data)))
    .catch(e => dispatch(chatPingUserFail(e.message)))
}

export const chatSubscribe = () => subscribe

export const chatUnsubscribe = unsubscribe