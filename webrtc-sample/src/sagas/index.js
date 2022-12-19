import {all} from 'redux-saga/effects';

import appSagas from './app';
import authSagas from './auth';
import CallKeepController from './CallKeepController';
import chatSagas from './chat';
import infoSagas from './info';
import pushNotificationsSagas from './pushNotifications';
import usersSagas from './users';
import webRTCSagas from './webrtc';
import QBeventsSagas from './QBevents';

export default function* rootSaga() {
  yield all([
    ...appSagas,
    ...authSagas,
    ...CallKeepController,
    ...chatSagas,
    ...infoSagas,
    ...pushNotificationsSagas,
    ...usersSagas,
    ...webRTCSagas,
    ...QBeventsSagas,
  ]);
}
