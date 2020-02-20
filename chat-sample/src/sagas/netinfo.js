import { eventChannel } from 'redux-saga'
import { call, put, spawn, take } from 'redux-saga/effects'
import NetInfo from '@react-native-community/netinfo'

import {
  chatConnectAndSubscribe,
  networkStateChanged,
} from '../actionCreators'

function createNetInfoChannel() {
  return eventChannel(NetInfo.addEventListener)
}

export function* startNetInfoListener() {
  try {
    const netInfoChannel = yield call(createNetInfoChannel)
    while (true) {
      const state = yield take(netInfoChannel)
      yield put(networkStateChanged(state.isConnected))
      if (state.isConnected) {
        yield put(chatConnectAndSubscribe())
      }
    }
  } catch (e) {
    yield put({ type: 'ERROR', error: e.message })
  }
}

export default [
  spawn(startNetInfoListener)
]
