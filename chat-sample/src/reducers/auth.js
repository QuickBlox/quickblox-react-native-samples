import {
  AUTH_LOGIN_FAIL,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT_FAIL,
  AUTH_LOGOUT_REQUEST,
  AUTH_LOGOUT_SUCCESS,
  AUTH_SET_LOGIN,
  AUTH_SET_PASSWORD,
  USERS_UPDATE_REQUEST,
  USERS_UPDATE_FAIL,
  USERS_UPDATE_SUCCESS,
} from '../constants'

const initialState = {
  error: undefined,
  loading: false,
  loggedIn: false,
  login: '',
  password: '',
  session: undefined,
  user: undefined,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTH_SET_LOGIN: return { ...state, login: action.payload }
    case AUTH_SET_PASSWORD: return { ...state, password: action.payload }
    case AUTH_LOGIN_REQUEST:
    case AUTH_LOGOUT_REQUEST:
    case USERS_UPDATE_REQUEST:
      return { ...state, loading: true, error: undefined }
    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        loggedIn: true,
        login: initialState.login,
        password: initialState.password,
        session: action.payload.session,
        user: action.payload.user,
      }
    case USERS_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: { ...state.user, ...action.payload }
      }
    case AUTH_LOGIN_FAIL:
    case AUTH_LOGOUT_FAIL:
    case USERS_UPDATE_FAIL:
        return { ...state, loading: false, error: action.error }
    case AUTH_LOGOUT_SUCCESS: return initialState
    default: return state
  }
}