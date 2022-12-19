import {all, call, put, select, takeEvery} from 'redux-saga/effects';
import QB from 'quickblox-react-native-sdk';

import {
  createPushSubscriptionFailure,
  createPushSubscriptionSuccess,
  deletePushSubscriptionFailure,
  deletePushSubscriptionSuccess,
  pushNotificationCreateFail,
  pushNotificationCreateSuccess,
  removeUdid,
  saveUdid,
} from '../actionCreators';
import {
  PUSH_SUBSCRIPTION_CREATE_REQUEST,
  PUSH_SUBSCRIPTION_DELETE_REQUEST,
  WEBRTC_CALL_SUCCESS,
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

function* createSubscriptions(pushChannel) {
  try {
    const {token: deviceToken} = yield select(state => state.pushNotifications);
    const subscriptions = yield call(
      QB.subscriptions.create,
      {deviceToken, pushChannel}
    );
    yield put(createPushSubscriptionSuccess(subscriptions));
    const udid = subscriptions[0].deviceUdid;
    if (udid) {
      yield put(saveUdid(udid));
    }
  } catch (e) {
    yield put(createPushSubscriptionFailure(e.message || e));
  }
}

function* checkAndCreateSubscriptions(action) {
  try {
    const {channel} = action.payload
    const {udid} = yield select(state => state.pushNotifications);
    let isSubscriptionsExists = false;
    if (udid) {
      const subscriptions = yield call(getSubscriptions);
      isSubscriptionsExists = subscriptions.some(
        subscription => subscription.deviceUdid === udid,
      );
    }
    if (!isSubscriptionsExists) {
      yield call(createSubscriptions, channel);
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
    yield put(deletePushSubscriptionSuccess());
    if (typeof resolve === 'function') {
      resolve();
    }
  } catch (e) {
    yield put(deletePushSubscriptionFailure(e.message || e));
    if (typeof reject === 'function') {
      reject(e);
    }
  }
}

function* sendPush(action) {
  try {
    const {session} = action.payload;
    const user = yield select(({auth}) => auth.user);
    const username = user.fullName || user.phone || user.login || user.email;
    const contactIdentifier =
      session.opponentsIds.length > 1
        ? `${username} and ${session.opponentsIds.length - 1} other`
        : `${username}`;
    const push = {
      notificationType: QB.events.NOTIFICATION_TYPE.PUSH,
      payload: {
        conferenceType: `${session.type}`,
        contactIdentifier,
        initiatorId: `${session.initiatorId}`,
        ios_voip: 1,
        message: `${username} is calling you`,
        opponentsIDs: session.opponentsIds.join(),
        sessionID: session.id,
        timestamp: Date.now(),
        VOIPCall: 1,
      },
      recipientsIds: session.opponentsIds,
      senderId: user.id,
      type: QB.events.NOTIFICATION_EVENT_TYPE.ONE_SHOT,
    };
    const events = yield call(QB.events.create, push);
    yield put(pushNotificationCreateSuccess(events));
  } catch (e) {
    yield put(pushNotificationCreateFail(e.message));
  }
}

export default [
  takeEvery(PUSH_SUBSCRIPTION_CREATE_REQUEST, checkAndCreateSubscriptions),
  takeEvery(PUSH_SUBSCRIPTION_DELETE_REQUEST, removeSubscriptions),
  takeEvery(WEBRTC_CALL_SUCCESS, sendPush),
];

