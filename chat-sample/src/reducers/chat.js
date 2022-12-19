import QB from 'quickblox-react-native-sdk';

import {
  AUTH_LOGOUT_SUCCESS,
  CHAT_CONNECT_FAIL,
  CHAT_CONNECT_REQUEST,
  CHAT_CONNECT_SUCCESS,
  CHAT_DISCONNECT_FAIL,
  CHAT_DISCONNECT_REQUEST,
  CHAT_DISCONNECT_SUCCESS,
  CHAT_IS_CONNECTED_SUCCESS,
  CHAT_RECONNECT_SUCCESS,
} from '../constants';

const initialState = {
  connected: false,
  error: undefined,
  loading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CHAT_IS_CONNECTED_SUCCESS:
      return {...state, connected: action.payload, loading: false};
    case CHAT_CONNECT_REQUEST:
    case CHAT_DISCONNECT_REQUEST:
      return {...state, error: undefined, loading: true};
    case CHAT_CONNECT_SUCCESS:
    case QB.chat.EVENT_TYPE.CONNECTED:
    case CHAT_RECONNECT_SUCCESS:
      return {...state, connected: true, loading: false};
    case CHAT_CONNECT_FAIL:
    case CHAT_DISCONNECT_FAIL:
      return {...state, error: action.error, loading: false};
    case CHAT_DISCONNECT_SUCCESS:
    case QB.chat.EVENT_TYPE.CONNECTION_CLOSED:
    case QB.chat.EVENT_TYPE.RECONNECTION_FAILED:
    case AUTH_LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
