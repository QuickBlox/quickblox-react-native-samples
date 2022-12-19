import {
  DEVICE_UDID_SET,
  DEVICE_UDID_REMOVE,
  PUSH_TOKEN_SET,
  PUSH_TOKEN_REMOVE,
} from '../constants';

const initialState = {
  token: undefined,
  udid: undefined,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case DEVICE_UDID_SET:
      return {...state, udid: action.payload};
    case PUSH_TOKEN_SET:
      return {...state, token: action.payload};
    case DEVICE_UDID_REMOVE:
      return {...state, udid: initialState.udid};
    case PUSH_TOKEN_REMOVE:
      return {...state, token: initialState.token};
    default:
      return state;
  }
};
