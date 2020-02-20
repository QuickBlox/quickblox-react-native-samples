import { eventChannel } from 'redux-saga'
import {
  call,
  put,
  race,
  select,
  spawn,
  take,
  takeLatest,
} from 'redux-saga/effects'
import { AppState } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import QB from 'quickblox-react-native-sdk'

import {
  appStartFail,
  appStartSuccess,
  chatConnect,
  chatConnectAndSubscribe,
  chatDisconnect,
  connectionStateChanged,
  webrtcInit,
  webrtcRelease,
} from '../actionCreators'
import {
  CHAT_CONNECT_AND_SUBSCRIBE,
  CHAT_CONNECT_FAIL,
  CHAT_CONNECT_SUCCESS,
  INIT_QB_REQUEST,
} from '../constants'
import { isChatConnected } from './chat'

export function* appStart(action = {}) {
  const config = action.payload
  try {
    yield call(QB.settings.init, config)
    yield put(appStartSuccess())
  } catch (e) {
    yield put(appStartFail(e.message))
  }
}

export function* connectAndSubscribe() {
  const { user } = yield select(state => state.auth)
  if (!user) return
  const chatConnected = yield call(isChatConnected)
  const { networkConnected, loading } = yield select(({ app, chat }) => ({
    networkConnected: app.connected,
    loading: chat.loading,
  }))
  if (!networkConnected) return
  if (!chatConnected) {
    if (!loading) {
      yield put(chatConnect({
          userId: user.id,
          password: user.password,
      }))
    }
    const { fail } = yield race({
      success: take(CHAT_CONNECT_SUCCESS),
      fail: take(CHAT_CONNECT_FAIL),
    })
    if (fail) {
      return
    }
  }
  yield put(webrtcInit())
}

function createAppStateChannel() {
  return eventChannel(emit => {
    AppState.addEventListener('change', emit)
    return () => AppState.removeEventListener('change', emit)
  })
}

export function* startAppStateListener() {
  try {
    const appStateChannel = yield call(createAppStateChannel)
    while (true) {
      const nextAppState = yield take(appStateChannel)
      yield call(appStateChangeHandler, nextAppState)
    }
  } catch (e) {
    yield put({ type: 'ERROR', error: e.message })
  }
}

export function* startNetInfoStateListener() {
  try {
    const channel = eventChannel(NetInfo.addEventListener)
    while (true) {
      const state = yield take(channel)
      yield put(connectionStateChanged(state.isConnected))
      const wasConnected = yield select(({ chat }) => chat.connected)
      if (!wasConnected && state.isConnected) {
        yield put(chatConnectAndSubscribe())
      }
    }
  } catch (e) {
    yield put({ type: 'NETINFO_CHANNEL_ERROR', error: e.message })
  }
}

function* appStateChangeHandler(appState) {
  const { connected, session } = yield select(({ chat, webrtc }) => ({
    connected: chat.connected,
    session: webrtc.session,
  }))
  if (appState.match(/inactive|background/)) {
    if (connected && !session) {
      yield put(chatDisconnect())
      yield put(webrtcRelease())
    }
  } else {
    yield put(chatConnectAndSubscribe())
  }
}

export default [
  takeLatest(INIT_QB_REQUEST, appStart),
  takeLatest(CHAT_CONNECT_AND_SUBSCRIBE, connectAndSubscribe),
  spawn(startAppStateListener),
  spawn(startNetInfoStateListener),
]
