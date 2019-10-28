import QB from 'quickblox-react-native-sdk'

import {
  appStart,
  appStartFail,
  appStartSuccess,
} from '../actionCreators'
import {
  chatConnectThunk,
  chatDisconnectThunk,
  chatSubscribe,
  chatUnsubscribe,
  isChatConnected,
} from './chat'

export const appStartThunk = config => dispatch => {
  dispatch(appStart())
  return QB
    .settings
    .init(config)
    .then(() => dispatch(appStartSuccess()))
    .catch(e => dispatch(appStartFail(e.message)))
}

export const connectAndSubscribe = () => (dispatch, getState) => {
  const { auth } = getState()
  if (auth.user) {
    return dispatch(isChatConnected()).then(action => {
      const connected = action.payload
      let connectionPromise
      if (connected) {
        connectionPromise = Promise.resolve()
      } else {
        connectionPromise = dispatch(chatConnectThunk({
          userId: auth.user.id,
          password: auth.user.password,
        }))
      }
      return connectionPromise.then(() => {
        dispatch(chatSubscribe())
      })
    })
  } else {
    return Promise.resolve()
  }
}

export const trackAppState = (appState) => (dispatch, getState) => {
  const { chat } = getState()
  if (appState.match(/inactive|background/)) {
    chatUnsubscribe()
    if (chat.connected) {
      dispatch(chatDisconnectThunk())
    }
  } else {
    dispatch(connectAndSubscribe())
  }
}