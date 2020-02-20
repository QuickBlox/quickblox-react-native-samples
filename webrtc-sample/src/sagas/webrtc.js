import { call, put, takeEvery } from 'redux-saga/effects'
import QB from 'quickblox-react-native-sdk'

import {
  webrtcInitSuccess,
  webrtcInitFail,
  webrtcReleaseSuccess,
  webrtcReleaseFail,
  webrtcCallSuccess,
  webrtcCallFail,
  webrtcAcceptSuccess,
  webrtcAcceptFail,
  webrtcRejectSuccess,
  webrtcRejectFail,
  webrtcHangUpSuccess,
  webrtcHangUpFail,
  webrtcSwitchCameraSuccess,
  webrtcSwitchCameraFail,
  webrtcToggleAudioSuccess,
  webrtcToggleAudioFail,
  webrtcToggleVideoSuccess,
  webrtcToggleVideoFail,
  webrtcSwitchAudioOutputSuccess,
  webrtcSwitchAudioOutputFail,
} from '../actionCreators'
import {
  AUTH_LOGOUT_REQUEST,
  WEBRTC_ACCEPT_REQUEST,
  WEBRTC_CALL_REQUEST,
  WEBRTC_CALL_SUCCESS,
  WEBRTC_HANGUP_REQUEST,
  WEBRTC_INIT_REQUEST,
  WEBRTC_REJECT_REQUEST,
  WEBRTC_RELEASE_REQUEST,
  WEBRTC_SWITCH_CAMERA_REQUEST,
  WEBRTC_TOGGLE_AUDIO_REQUEST,
  WEBRTC_TOGGLE_VIDEO_REQUEST,
  WEBRTC_SWITCH_AUDIO_OUTPUT_REQUEST,
} from '../constants'
import Navigation from '../NavigationService'

export function* initWebRTC() {
  try {
    yield call(QB.webrtc.init)
    yield put(webrtcInitSuccess())
  } catch (e) {
    yield put(webrtcInitFail(e.message))
  }
}

export function* disposeWebRTC() {
  try {
    yield call(QB.webrtc.release)
    yield put(webrtcReleaseSuccess())
  } catch (e) {
    yield put(webrtcReleaseFail(e.message))
  }
}

export function* callSaga(action) {
  try {
    const { payload } = action
    const session = yield call(QB.webrtc.call, payload)
    yield put(webrtcCallSuccess(session))
  } catch (e) {
    yield put(webrtcCallFail(e.message))
  }
}

export function* accept(action) {
  try {
    const { payload } = action
    const session = yield call(QB.webrtc.accept, payload)
    yield put(webrtcAcceptSuccess(session))
  } catch (e) {
    yield put(webrtcAcceptFail(e.message))
  }
}

export function* reject(action) {
  try {
    const { payload } = action
    const session = yield call(QB.webrtc.reject, payload)
    yield put(webrtcRejectSuccess(session))
  } catch (e) {
    yield put(webrtcRejectFail(e.message))
  }
}

export function* hangUp(action) {
  try {
    const { payload } = action
    const session = yield call(QB.webrtc.hangUp, payload)
    yield put(webrtcHangUpSuccess(session))
  } catch (e) {
    yield put(webrtcHangUpFail(e.message))
  }
}

export function* toggleAudio(action) {
  try {
    const { payload } = action
    yield call(QB.webrtc.enableAudio, payload)
    yield put(webrtcToggleAudioSuccess())
  } catch (e) {
    yield put(webrtcToggleAudioFail(e.message))
  }
}

export function* toggleVideo(action) {
  try {
    const { payload } = action
    yield call(QB.webrtc.enableVideo, payload)
    yield put(webrtcToggleVideoSuccess())
  } catch (e) {
    yield put(webrtcToggleVideoFail(e.message))
  }
}

export function* switchAudioOutput(action) {
  try {
    yield call(QB.webrtc.switchAudioOutput, action.payload)
    yield put(webrtcSwitchAudioOutputSuccess())
  } catch (e) {
    yield put(webrtcSwitchAudioOutputFail(e.message))
  }
}

export function* switchCamera(action) {
  try {
    const { payload } = action
    yield call(QB.webrtc.switchCamera, payload)
    yield put(webrtcSwitchCameraSuccess())
  } catch (e) {
    yield put(webrtcSwitchCameraFail(e.message))
  }
}

function* redirectToCallScreen() {
  Navigation.navigate({ routeName: 'CallScreen' })
}

export default [
  takeEvery(WEBRTC_ACCEPT_REQUEST, accept),
  takeEvery(WEBRTC_CALL_REQUEST, callSaga),
  takeEvery(WEBRTC_CALL_SUCCESS, redirectToCallScreen),
  takeEvery(WEBRTC_HANGUP_REQUEST, hangUp),
  takeEvery(WEBRTC_INIT_REQUEST, initWebRTC),
  takeEvery(WEBRTC_REJECT_REQUEST, reject),
  takeEvery([AUTH_LOGOUT_REQUEST, WEBRTC_RELEASE_REQUEST], disposeWebRTC),
  takeEvery(WEBRTC_SWITCH_AUDIO_OUTPUT_REQUEST, switchAudioOutput),
  takeEvery(WEBRTC_SWITCH_CAMERA_REQUEST, switchCamera),
  takeEvery(WEBRTC_TOGGLE_AUDIO_REQUEST, toggleAudio),
  takeEvery(WEBRTC_TOGGLE_VIDEO_REQUEST, toggleVideo),
]