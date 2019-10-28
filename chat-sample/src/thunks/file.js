import QB from 'quickblox-react-native-sdk'

import {
  fileUpload,
  fileUploadFail,
  fileUploadSucess,
  privateUrlGet,
  privateUrlGetFail,
  privateUrlGetSuccess,
  fileGetInfo,
  fileGetInfoSuccess,
  fileGetInfoFail,
} from '../actionCreators'

export const uploadFile = url => dispatch => {
  dispatch(fileUpload(url))
  return QB
    .content
    .upload({ url, public: false })
    .then(file => dispatch(fileUploadSucess(file)))
    .catch(e => dispatch(fileUploadFail(e.message)))
}

export const getFileInfo = id => dispatch => {
  dispatch(fileGetInfo(id))
  return QB
    .content
    .getInfo({ id })
    .then(info => dispatch(fileGetInfoSuccess(info)))
    .catch(e => dispatch(fileGetInfoFail(e.message)))
}

export const getPrivateUrl = uid => dispatch => {
  dispatch(privateUrlGet(uid))
  return QB
    .content
    .getPrivateURL({ uid })
    .then(url => dispatch(privateUrlGetSuccess(uid, url)))
    .catch(e => dispatch(privateUrlGetFail(e.message)))
}