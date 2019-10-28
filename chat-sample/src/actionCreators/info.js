import {
  GET_INFO_FAIL,
  GET_INFO_REQUEST,
  GET_INFO_SUCCESS,
} from '../constants'

export function getInfo() {
  return { type: GET_INFO_REQUEST }
}

export function getInfoSuccess(info) {
  return { type: GET_INFO_SUCCESS, payload: info }
}

export function getInfoFail(error) {
  return { type: GET_INFO_FAIL, error }
}