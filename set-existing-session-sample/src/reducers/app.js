import {
  INIT_QB_REQUEST_FAIL,
  INIT_QB_REQUEST_SUCCESS,
  NETWORK_STATE_CHANGED,
  SETUP_TOKEN,
} from '../constants';

const initialState = {
  connected: false,
  ready: undefined,
  token: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case INIT_QB_REQUEST_SUCCESS: {
      return {...state, ready: true};
    }
    case INIT_QB_REQUEST_FAIL: {
      return {...state, ready: false};
    }
    case NETWORK_STATE_CHANGED:
      return {...state, connected: action.payload};
    case SETUP_TOKEN:
      return {...state, token: action.payload};
    default:
      return state;
  }
};
