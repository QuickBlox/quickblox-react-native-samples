import {
  PUSH_SUBSCRIPTION_CREATE_SUCCESS,
  PUSH_SUBSCRIPTION_DELETE_SUCCESS,
} from '../constants';

export default (state = [], action) => {
  switch (action.type) {
    case PUSH_SUBSCRIPTION_CREATE_SUCCESS:
      return action.payload;
    case PUSH_SUBSCRIPTION_DELETE_SUCCESS:
      return [];
    default:
      return state;
  }
};
