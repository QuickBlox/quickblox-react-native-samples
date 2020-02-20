import { all } from 'redux-saga/effects'

import appSagas from './app'
import authSagas from './auth'
import chatSagas from './chat'
import eventsSagas from './events'
import infoSagas from './info'
import usersSagas from './users'
import webRTCSagas from './webrtc'
import QBeventsSagas from './QBevents'

export default function* rootSaga() {
  yield all([
    ...appSagas,
    ...authSagas,
    ...chatSagas,
    ...eventsSagas,
    ...infoSagas,
    ...usersSagas,
    ...webRTCSagas,
    ...QBeventsSagas,
  ])
}