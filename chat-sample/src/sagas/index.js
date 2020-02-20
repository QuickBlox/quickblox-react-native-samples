import { all } from 'redux-saga/effects'

import appSagas from './app'
import authSagas from './auth'
import chatSagas from './chat'
import dialogsSagas from './dialogs'
import fileSagas from './file'
import infoSagas from './info'
import messagesSagas from './messages'
import netInfoSagas from './netinfo'
import usersSagas from './users'
import QBeventsSagas from './QBevents'

export default function* rootSaga() {
  yield all([
    ...appSagas,
    ...authSagas,
    ...chatSagas,
    ...dialogsSagas,
    ...fileSagas,
    ...infoSagas,
    ...messagesSagas,
    ...netInfoSagas,
    ...usersSagas,
    ...QBeventsSagas,
  ])
}
