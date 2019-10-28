import QB from 'quickblox-react-native-sdk'

import {
  loginFail,
  loginRequest,
  loginSuccess,
  logoutFail,
  logoutRequest,
  logoutSuccess,
  sessionGet,
  sessionGetFail,
  sessionGetSuccess,
} from '../actionCreators'
import { showError } from '../NotificationService'

export const login = ({ login, password = 'quickblox' }) => dispatch => {
  dispatch(loginRequest({ login, password }))
  return QB
    .auth
    .login({ login, password })
    .then(({ session, user }) => dispatch(loginSuccess({
      session,
      user: { ...user, password },
    })))
    .catch(e => dispatch(loginFail(e.message)))
}

export const logout = () => dispatch => {
  dispatch(logoutRequest())
  return QB
    .auth
    .logout()
    .then(() => dispatch(logoutSuccess()))
    .catch(e => {
      dispatch(logoutFail(e.message))
      showError(e.message)
    })
}

export const getSession = () => dispatch => {
  dispatch(sessionGet())
  return QB
    .auth
    .getSession()
    .then(session => dispatch(sessionGetSuccess(session)))
    .catch(e => dispatch(sessionGetFail(e.message)))
}
