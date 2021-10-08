import {eventChannel} from 'redux-saga';
import {call, put, select, spawn, take} from 'redux-saga/effects';
import NetInfo from '@react-native-community/netinfo';

import {chatConnectAndSubscribe, networkStateChanged} from '../actionCreators';

function createNetInfoChannel() {
  return eventChannel(NetInfo.addEventListener);
}

export function* startNetInfoListener() {
  try {
    const netInfoChannel = yield call(createNetInfoChannel);
    while (true) {
      const state = yield take(netInfoChannel);
      yield put(networkStateChanged(state.isConnected));
      const isConnected = yield select(({app}) => app.connected);
      if (state.isConnected && state.isConnected !== isConnected) {
        yield put(chatConnectAndSubscribe());
      }
    }
  } catch (e) {
    yield put({error: e.message, type: 'ERROR'});
  }
}

export default [spawn(startNetInfoListener)];
