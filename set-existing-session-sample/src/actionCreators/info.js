import {GET_INFO_FAIL, GET_INFO_REQUEST, GET_INFO_SUCCESS} from '../constants';

export function getInfo() {
  return {type: GET_INFO_REQUEST};
}

export function getInfoSuccess(info) {
  return {payload: info, type: GET_INFO_SUCCESS};
}

export function getInfoFail(error) {
  return {error, type: GET_INFO_FAIL};
}
