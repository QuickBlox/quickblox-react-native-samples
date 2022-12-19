import {
  PUSH_SUBSCRIPTION_CREATE_FAIL,
  PUSH_SUBSCRIPTION_CREATE_REQUEST,
  PUSH_SUBSCRIPTION_CREATE_SUCCESS,
  PUSH_SUBSCRIPTION_DELETE_FAIL,
  PUSH_SUBSCRIPTION_DELETE_REQUEST,
  PUSH_SUBSCRIPTION_DELETE_SUCCESS,
} from '../constants';

export function createPushSubscription(channel) {
  return {
    type: PUSH_SUBSCRIPTION_CREATE_REQUEST,
    payload: {channel},
  };
}

export function createPushSubscriptionSuccess(payload) {
  return {type: PUSH_SUBSCRIPTION_CREATE_SUCCESS, payload};
}

export function createPushSubscriptionFailure(error) {
  return {type: PUSH_SUBSCRIPTION_CREATE_FAIL, error};
}

export function deletePushSubscription({resolve, reject}) {
  return {
    type: PUSH_SUBSCRIPTION_DELETE_REQUEST,
    payload: {resolve, reject},
  };
}

export function deletePushSubscriptionSuccess() {
  return {type: PUSH_SUBSCRIPTION_DELETE_SUCCESS};
}

export function deletePushSubscriptionFailure(error) {
  return {type: PUSH_SUBSCRIPTION_DELETE_FAIL, error};
}
