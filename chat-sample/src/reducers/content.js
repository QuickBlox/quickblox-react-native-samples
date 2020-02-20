import QB from 'quickblox-react-native-sdk'
import {
  AUTH_LOGOUT_SUCCESS,
  FILE_PRIVATE_URL_SUCCESS,
  FILE_PUBLIC_URL_SUCCESS,
  FILE_UPLOAD_CANCEL,
  FILE_UPLOAD_FAIL,
  FILE_UPLOAD_REQUEST,
  FILE_UPLOAD_SUCCESS,
} from '../constants'

const initialState = {
  uploading: false,
  uploadProgress: 0,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FILE_PRIVATE_URL_SUCCESS:
    case FILE_PUBLIC_URL_SUCCESS:
      return { ...state, [action.payload.uid]: action.payload.url }
    case FILE_UPLOAD_REQUEST:
      return { ...state, uploading: true }
    case FILE_UPLOAD_CANCEL:
    case FILE_UPLOAD_FAIL:
    case FILE_UPLOAD_SUCCESS:
      return { ...state, ...initialState }
    case QB.content.EVENT_TYPE.FILE_UPLOAD_PROGRESS:
      return { ...state, uploadProgress: action.payload.progress }
    case AUTH_LOGOUT_SUCCESS: return initialState
    default: return state
  }
}