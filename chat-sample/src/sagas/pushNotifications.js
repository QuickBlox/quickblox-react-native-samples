import {all, call, put, select, takeEvery} from 'redux-saga/effects';
import QB from 'quickblox-react-native-sdk';

import {saveUdid, removeUdid} from '../actionCreators';
import {
  CREATE_PUSH_SUBSCRIPTIONS,
  REMOVE_PUSH_SUBSCRIPTIONS,
} from '../constants';

function* getSubscriptions() {
  try {
    const subscriptions = yield call(QB.subscriptions.get);
    return subscriptions;
  } catch (e) {
    if (__DEV__) {
      console.warn(e);
    }
    return [];
  }
}

function* createSubscriptions() {
  try {
    const {token: deviceToken} = yield select(state => state.pushNotifications);
    const subscriptions = yield call(QB.subscriptions.create, {deviceToken});
    const udid = subscriptions[0].deviceUdid;
    if (udid) {
      yield put(saveUdid(udid));
    }
  } catch (e) {
    if (__DEV__) {
      console.warn(e);
    }
  }
}

function* checkAndCreateSubscriptions() {
  try {
    const {udid} = yield select(state => state.pushNotifications);
    let isSubscriptionsExists = false;
    if (udid) {
      const subscriptions = yield call(getSubscriptions);
      isSubscriptionsExists = subscriptions.some(
        subscription => subscription.deviceUdid === udid,
      );
    }
    if (!isSubscriptionsExists) {
      yield call(createSubscriptions);
    }
  } catch (e) {
    if (__DEV__) {
      console.warn(e);
    }
  }
}

function* removeSubscriptions(action) {
  const {resolve, reject} = action.payload || {};
  try {
    const {udid} = yield select(state => state.pushNotifications);
    if (udid) {
      const subscriptions = yield call(getSubscriptions);
      yield all(
        subscriptions
          .map(subscription =>
            subscription.deviceUdid === udid
              ? call(QB.subscriptions.remove, {id: subscription.id})
              : undefined,
          )
          .filter(Boolean),
      );
      yield put(removeUdid());
    }
    if (typeof resolve === 'function') {
      resolve();
    }
  } catch (e) {
    if (__DEV__) {
      console.warn(e);
    }
    if (typeof reject === 'function') {
      reject(e);
    }
  }
}

export default [
  takeEvery(CREATE_PUSH_SUBSCRIPTIONS, checkAndCreateSubscriptions),
  takeEvery(REMOVE_PUSH_SUBSCRIPTIONS, removeSubscriptions),
];
