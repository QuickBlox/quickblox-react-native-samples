import {
  WEBRTC_ACCEPT_FAIL,
  WEBRTC_ACCEPT_REQUEST,
  WEBRTC_ACCEPT_SUCCESS,
  WEBRTC_CALL_FAIL,
  WEBRTC_CALL_REQUEST,
  WEBRTC_CALL_SUCCESS,
  WEBRTC_HANGUP_FAIL,
  WEBRTC_HANGUP_REQUEST,
  WEBRTC_HANGUP_SUCCESS,
  WEBRTC_INIT_FAIL,
  WEBRTC_INIT_REQUEST,
  WEBRTC_INIT_SUCCESS,
  WEBRTC_REJECT_FAIL,
  WEBRTC_REJECT_REQUEST,
  WEBRTC_REJECT_SUCCESS,
  WEBRTC_RELEASE_FAIL,
  WEBRTC_RELEASE_REQUEST,
  WEBRTC_RELEASE_SUCCESS,
  WEBRTC_SWITCH_CAMERA_FAIL,
  WEBRTC_SWITCH_CAMERA_REQUEST,
  WEBRTC_SWITCH_CAMERA_SUCCESS,
  WEBRTC_TOGGLE_AUDIO_FAIL,
  WEBRTC_TOGGLE_AUDIO_REQUEST,
  WEBRTC_TOGGLE_AUDIO_SUCCESS,
  WEBRTC_TOGGLE_VIDEO_FAIL,
  WEBRTC_TOGGLE_VIDEO_REQUEST,
  WEBRTC_TOGGLE_VIDEO_SUCCESS,
  WEBRTC_SWITCH_AUDIO_OUTPUT_REQUEST,
  WEBRTC_SWITCH_AUDIO_OUTPUT_SUCCESS,
  WEBRTC_SWITCH_AUDIO_OUTPUT_FAIL,
} from '../constants'

export function webrtcInit() {
  return { type: WEBRTC_INIT_REQUEST }
}

export function webrtcInitSuccess() {
  return { type: WEBRTC_INIT_SUCCESS }
}

export function webrtcInitFail(error) {
  return { type: WEBRTC_INIT_FAIL, error }
}

export function webrtcRelease() {
  return { type: WEBRTC_RELEASE_REQUEST }
}

export function webrtcReleaseSuccess() {
  return { type: WEBRTC_RELEASE_SUCCESS }
}

export function webrtcReleaseFail(error) {
  return { type: WEBRTC_RELEASE_FAIL, error }
}

export function webrtcCall(payload) {
  return { type: WEBRTC_CALL_REQUEST, payload }
}

export function webrtcCallSuccess(session) {
  return {
    type: WEBRTC_CALL_SUCCESS,
    payload: { session }
  }
}

export function webrtcCallFail(error) {
  return { type: WEBRTC_CALL_FAIL, error }
}

export function webrtcAccept(payload) {
  return { type: WEBRTC_ACCEPT_REQUEST, payload }
}

export function webrtcAcceptSuccess(session) {
  return {
    type: WEBRTC_ACCEPT_SUCCESS,
    payload: { session }
  }
}

export function webrtcAcceptFail(error) {
  return { type: WEBRTC_ACCEPT_FAIL, error }
}

export function webrtcReject(payload) {
  return { type: WEBRTC_REJECT_REQUEST, payload }
}

export function webrtcRejectSuccess(session) {
  return {
    type: WEBRTC_REJECT_SUCCESS,
    payload: { session }
  }
}

export function webrtcRejectFail(error) {
  return { type: WEBRTC_REJECT_FAIL, error }
}

export function webrtcHangUp(payload) {
  return { type: WEBRTC_HANGUP_REQUEST, payload }
}

export function webrtcHangUpSuccess(session) {
  return {
    type: WEBRTC_HANGUP_SUCCESS,
    payload: { session }
  }
}

export function webrtcHangUpFail(error) {
  return { type: WEBRTC_HANGUP_FAIL, error }
}

export function webrtcToggleAudio(payload) {
  return { type: WEBRTC_TOGGLE_AUDIO_REQUEST, payload }
}

export function webrtcToggleAudioSuccess() {
  return { type: WEBRTC_TOGGLE_AUDIO_SUCCESS }
}

export function webrtcToggleAudioFail(error) {
  return { type: WEBRTC_TOGGLE_AUDIO_FAIL, error }
}

export function webrtcToggleVideo(payload) {
  return { type: WEBRTC_TOGGLE_VIDEO_REQUEST, payload }
}

export function webrtcToggleVideoSuccess() {
  return { type: WEBRTC_TOGGLE_VIDEO_SUCCESS }
}

export function webrtcToggleVideoFail(error) {
  return { type: WEBRTC_TOGGLE_VIDEO_FAIL, error }
}

export function webrtcSwitchCamera(payload) {
  return { type: WEBRTC_SWITCH_CAMERA_REQUEST, payload }
}

export function webrtcSwitchCameraSuccess() {
  return { type: WEBRTC_SWITCH_CAMERA_SUCCESS }
}

export function webrtcSwitchCameraFail(error) {
  return { type: WEBRTC_SWITCH_CAMERA_FAIL, error }
}

export function webrtcSwitchAudioOutput(payload) {
  return { type: WEBRTC_SWITCH_AUDIO_OUTPUT_REQUEST, payload }
}

export function webrtcSwitchAudioOutputSuccess(payload) {
  return { type: WEBRTC_SWITCH_AUDIO_OUTPUT_SUCCESS, payload }
}

export function webrtcSwitchAudioOutputFail(error) {
  return { type: WEBRTC_SWITCH_AUDIO_OUTPUT_FAIL, error }
}
