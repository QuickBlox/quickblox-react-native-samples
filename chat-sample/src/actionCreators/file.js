import {
  FILE_GET_INFO_FAIL,
  FILE_GET_INFO_REQUEST,
  FILE_GET_INFO_SUCCESS,
  FILE_PRIVATE_URL_FAIL,
  FILE_PRIVATE_URL_REQUEST,
  FILE_PRIVATE_URL_SUCCESS,
  FILE_PUBLIC_URL_FAIL,
  FILE_PUBLIC_URL_REQUEST,
  FILE_PUBLIC_URL_SUCCESS,
  FILE_UPLOAD_CANCEL,
  FILE_UPLOAD_FAIL,
  FILE_UPLOAD_REQUEST,
  FILE_UPLOAD_SUCCESS,
} from '../constants';

export function fileGetInfo(id) {
  return {payload: id, type: FILE_GET_INFO_REQUEST};
}

export function fileGetInfoSuccess(info) {
  return {payload: info, type: FILE_GET_INFO_SUCCESS};
}

export function fileGetInfoFail(error) {
  return {error, type: FILE_GET_INFO_FAIL};
}

export function fileUpload(payload) {
  return {payload, type: FILE_UPLOAD_REQUEST};
}

export function fileUploadSucess(file) {
  return {payload: file, type: FILE_UPLOAD_SUCCESS};
}

export function fileUploadFail(error) {
  return {error, type: FILE_UPLOAD_FAIL};
}

export function fileUploadCancel() {
  return {type: FILE_UPLOAD_CANCEL};
}

export function privateUrlGet(uid) {
  return {payload: uid, type: FILE_PRIVATE_URL_REQUEST};
}

export function privateUrlGetSuccess(uid, url) {
  return {payload: {uid, url}, type: FILE_PRIVATE_URL_SUCCESS};
}

export function privateUrlGetFail(error) {
  return {error, type: FILE_PRIVATE_URL_FAIL};
}

export function publicUrlGet(uid) {
  return {payload: uid, type: FILE_PUBLIC_URL_REQUEST};
}

export function publicUrlGetSuccess(uid, url) {
  return {payload: {uid, url}, type: FILE_PUBLIC_URL_SUCCESS};
}

export function publicUrlGetFail(error) {
  return {error, type: FILE_PUBLIC_URL_FAIL};
}
