import QB from 'quickblox-react-native-sdk'

import {
  WEBRTC_ACCEPT_SUCCESS,
  WEBRTC_CALL_SUCCESS,
  WEBRTC_INIT_FAIL,
  WEBRTC_INIT_REQUEST,
  WEBRTC_INIT_SUCCESS,
  WEBRTC_RELEASE_FAIL,
  WEBRTC_RELEASE_REQUEST,
  WEBRTC_RELEASE_SUCCESS,
} from '../constants'

const initialState = {
  loading: false,
  onCall: false,
  opponentsLeftCall: [],
  session: undefined,
  peers: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case WEBRTC_INIT_REQUEST:
    case WEBRTC_RELEASE_REQUEST:
      return { ...state, loading: true }
    case WEBRTC_INIT_FAIL:
    case WEBRTC_INIT_SUCCESS:
    case WEBRTC_RELEASE_FAIL:
    case WEBRTC_RELEASE_SUCCESS:
      return { ...state, loading: false }
    case WEBRTC_CALL_SUCCESS:
      return { ...state, session: action.payload.session }
    case WEBRTC_ACCEPT_SUCCESS:
    case QB.webrtc.EVENT_TYPE.ACCEPT:
      return { ...state, onCall: true, session: action.payload.session }
    case QB.webrtc.EVENT_TYPE.CALL:
      return { ...state, session: action.payload.session }
    case QB.webrtc.EVENT_TYPE.HANG_UP:
    case QB.webrtc.EVENT_TYPE.REJECT:
    case QB.webrtc.EVENT_TYPE.NOT_ANSWER: {
      const { session, userId } = action.payload
      if (!state.session || session.id !== state.session.id) {
        return state
      }
      return {
        ...state,
        opponentsLeftCall: state.opponentsLeftCall.concat(userId)
      }
    }
    case QB.webrtc.EVENT_TYPE.PEER_CONNECTION_STATE_CHANGED: {
      const { session, state: peerState, userId } = action.payload
      if (!state.session || session.id !== state.session.id) {
        return state
      }
      return {
        ...state,
        session,
        peers: { ...state.peers, [userId]: peerState }
      }
    }
    case QB.webrtc.EVENT_TYPE.CALL_END: {
      const { session } = action.payload
      if (!state.session || state.session.id === session.id) {
        return initialState
      } else {
        return state
      }
    }
    default:
      return state
  }
}
