import {
  AUTH_LOGOUT_SUCCESS,
  FILE_PRIVATE_URL_SUCCESS,
  FILE_PUBLIC_URL_SUCCESS,
} from '../constants'

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case FILE_PRIVATE_URL_SUCCESS:
    case FILE_PUBLIC_URL_SUCCESS:
      return { ...state, [action.payload.uid]: action.payload.url }
    case AUTH_LOGOUT_SUCCESS: return initialState
    default: return state
  }
}