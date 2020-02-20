import { call, put, select, takeLatest } from 'redux-saga/effects'
import QB from 'quickblox-react-native-sdk'

import { eventCreateSuccess, eventCreateFail } from '../actionCreators'
import { WEBRTC_CALL_SUCCESS } from '../constants'

function* sendPush(action) {
  try {
    const { session } = action.payload
    const user = yield select(({ auth }) => auth.user)
    const username = user.fullName || user.login || user.email
    const push = {
      notificationType: QB.events.NOTIFICATION_TYPE.PUSH,
      payload: {
        message: `Incoming call from ${username}`
      },
      recipientsIds: session.opponentsIds,
      senderId: user.id,
      type: QB.events.NOTIFICATION_EVENT_TYPE.ONE_SHOT,
    }
    const events = yield call(QB.events.create, push)
    yield put(eventCreateSuccess(events))
  } catch (e) {
    yield put(eventCreateFail(e.message))
  }
}

export default [
  takeLatest(WEBRTC_CALL_SUCCESS, sendPush),
]
