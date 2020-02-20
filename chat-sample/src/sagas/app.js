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
import QB from 'quickblox-react-native-sdk'

import {
  appStartFail,
  appStartSuccess,
  chatConnect,
  chatConnectAndSubscribe,
  chatDisconnect,
  dialogGet,
  messagesGet,
} from '../actionCreators'
import {
  CHAT_CONNECT_AND_SUBSCRIBE,
  CHAT_CONNECT_FAIL,
  CHAT_CONNECT_SUCCESS,
  INIT_QB_REQUEST,
} from '../constants'
import { isChatConnected } from './chat'
import Navigation from '../NavigationService'

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
  const connected = yield call(isChatConnected)
  const loading = yield select(({ chat }) => chat.loading)
  if (!connected) {
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
  yield call(setupQBSettings)
  yield put(dialogGet())
  const route = Navigation.getCurrentRoute()
  const { routeName, params = { dialog: {} } } = route || {}
  if (routeName === 'Messages' && params.dialog.id) {
    yield put(messagesGet({ dialogId: params.dialog.id }))
  }
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

function* appStateChangeHandler(appState) {
  const { connected, user } = yield select(({ auth, chat }) => ({
    connected: chat.connected,
    user: auth.user,
  }))
  if (user) {
    if (appState.match(/inactive|background/)) {
      if (connected) {
        yield put(chatDisconnect())
      }
    } else {
      yield put(chatConnectAndSubscribe())
    }
  }
}

function* setupQBSettings() {
  try {
    yield call(QB.settings.initStreamManagement, {
      autoReconnect: true,
      messageTimeout: 10,
    })
    yield call(QB.settings.enableCarbons)
    yield call(QB.settings.enableAutoReconnect, { enable: true })
  } catch (e) {
    yield put({ type: 'SETUP_QB_SETTINGS_ERROR', error: e.message })
  }
}

export default [
  takeLatest(INIT_QB_REQUEST, appStart),
  takeLatest(CHAT_CONNECT_AND_SUBSCRIBE, connectAndSubscribe),
  spawn(startAppStateListener),
]
