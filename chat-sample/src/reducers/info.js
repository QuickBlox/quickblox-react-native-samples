import {GET_INFO_FAIL, GET_INFO_REQUEST, GET_INFO_SUCCESS} from '../constants';

const initialState = {
  accountKey: '',
  apiEndpoint: '',
  appId: '',
  authKey: '',
  authSecret: '',
  chatEndpoint: '',
  error: '',
  loading: false,
  sdkVersion: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_INFO_REQUEST:
      return {...state, error: '', loading: true};
    case GET_INFO_SUCCESS:
      return {...state, ...action.payload, loading: false};
    case GET_INFO_FAIL:
      return {...state, error: action.error, loading: false};
    default:
      return state;
  }
};
