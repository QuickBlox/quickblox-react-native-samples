import QB from 'quickblox-react-native-sdk';

import {
  CALL_KEEP_INCOMING_CALL,
  WEBRTC_ACCEPT_SUCCESS,
  WEBRTC_CALL_SUCCESS,
  WEBRTC_HANGUP_REQUEST,
  WEBRTC_INIT_FAIL,
  WEBRTC_INIT_REQUEST,
  WEBRTC_INIT_SUCCESS,
  WEBRTC_REJECT_REQUEST,
  WEBRTC_RELEASE_FAIL,
  WEBRTC_RELEASE_REQUEST,
  WEBRTC_RELEASE_SUCCESS,
  WEBRTC_SWITCH_CAMERA_SUCCESS,
} from '../constants';

const initialState = {
  displayingUser: true,
  loading: false,
  onCall: false,
  peers: {},
  session: undefined,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case WEBRTC_INIT_REQUEST:
    case WEBRTC_RELEASE_REQUEST:
      return {...state, loading: true};
    case WEBRTC_INIT_FAIL:
    case WEBRTC_INIT_SUCCESS:
    case WEBRTC_RELEASE_FAIL:
    case WEBRTC_RELEASE_SUCCESS:
      return {...state, loading: false};
    case WEBRTC_CALL_SUCCESS:
    case QB.webrtc.EVENT_TYPE.CALL:
    case CALL_KEEP_INCOMING_CALL:
      return {
        ...state,
        session: action.payload.session,
        peers: action.payload.session.opponentsIds
          .concat(action.payload.session.initiatorId)
          .reduce((acc, userId) => ({
            ...acc,
            [userId]: QB.webrtc.RTC_PEER_CONNECTION_STATE.NEW
          }), {}),
      };
    case WEBRTC_ACCEPT_SUCCESS:
    case QB.webrtc.EVENT_TYPE.ACCEPT:
      return {...state, onCall: true, session: action.payload.session};
    case QB.webrtc.EVENT_TYPE.PEER_CONNECTION_STATE_CHANGED: {
      const {session, state: peerState, userId} = action.payload;
      if (!state.session || session.id !== state.session.id) {
        return state;
      }
      return {
        ...state,
        session,
        peers: {...state.peers, [userId]: peerState},
      };
    }
    case WEBRTC_SWITCH_CAMERA_SUCCESS:
      return {...state, displayingUser: !state.displayingUser};
    case WEBRTC_REJECT_REQUEST:
    case WEBRTC_HANGUP_REQUEST: {
      const {sessionId} = action.payload;
      if (!state.session || state.session.id === sessionId) {
        return initialState;
      } else {
        return state;
      }
    }
    case QB.webrtc.EVENT_TYPE.CALL_END: {
      const {session} = action.payload;
      if (!state.session || state.session.id === session.id) {
        return initialState;
      } else {
        return state;
      }
    }
    default:
      return state;
  }
};
