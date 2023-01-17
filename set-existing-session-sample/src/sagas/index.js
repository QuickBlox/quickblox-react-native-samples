import {all} from 'redux-saga/effects';

import appSagas from './app';
import authSagas from './auth';
import chatSagas from './chat';
import infoSagas from './info';
import QBeventsSagas from './QBevents';

export default function* rootSaga() {
  yield all([
    ...appSagas,
    ...authSagas,
    ...chatSagas,
    ...infoSagas,
    ...QBeventsSagas,
  ]);
}
