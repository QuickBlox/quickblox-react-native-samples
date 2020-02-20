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
} from '../constants'

export function fileGetInfo(id) {
  return { type: FILE_GET_INFO_REQUEST, payload: id }
}

export function fileGetInfoSuccess(info) {
  return { type: FILE_GET_INFO_SUCCESS, payload: info }
}

export function fileGetInfoFail(error) {
  return { type: FILE_GET_INFO_FAIL, error }
}

export function fileUpload(payload) {
  return { type: FILE_UPLOAD_REQUEST, payload }
}

export function fileUploadSucess(file) {
  return { type: FILE_UPLOAD_SUCCESS, payload: file }
}

export function fileUploadFail(error) {
  return { type: FILE_UPLOAD_FAIL, error }
}

export function fileUploadCancel() {
  return { type: FILE_UPLOAD_CANCEL }
}

export function privateUrlGet(uid) {
  return { type: FILE_PRIVATE_URL_REQUEST, payload: uid }
}

export function privateUrlGetSuccess(uid, url) {
  return { type: FILE_PRIVATE_URL_SUCCESS, payload: { uid, url } }
}

export function privateUrlGetFail(error) {
  return { type: FILE_PRIVATE_URL_FAIL, error }
}

export function publicUrlGet(uid) {
  return { type: FILE_PUBLIC_URL_REQUEST, payload: uid }
}

export function publicUrlGetSuccess(uid, url) {
  return { type: FILE_PUBLIC_URL_SUCCESS, payload: { uid, url } }
}

export function publicUrlGetFail(error) {
  return { type: FILE_PUBLIC_URL_FAIL, error }
}