import {
  NOTIFICATION_EVENT_CREATE_FAIL,
  NOTIFICATION_EVENT_CREATE_SUCCESS,
} from '../constants'

export function eventCreateSuccess(payload) {
  return { type: NOTIFICATION_EVENT_CREATE_SUCCESS, payload }
}

export function eventCreateFail(error) {
  return { type: NOTIFICATION_EVENT_CREATE_FAIL, error }
}
