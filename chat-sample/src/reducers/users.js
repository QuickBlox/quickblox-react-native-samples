import {
  AUTH_LOGOUT_SUCCESS,
  DIALOGS_CREATE_CANCEL,
  DIALOGS_CREATE_SUCCESS,
  USERS_BULK_SELECT,
  USERS_CREATE_FAIL,
  USERS_CREATE_REQUEST,
  USERS_CREATE_SUCCESS,
  USERS_GET_FAIL,
  USERS_GET_REQUEST,
  USERS_GET_SUCCESS,
  USERS_SELECT,
  USERS_SET_FILTER,
  USERS_SET_PAGE,
  DIALOGS_EDIT_CANCEL,
} from '../constants'

const initialState = {
  error: undefined,
  filter: '',
  loading: false,
  page: 1,
  perPage: 30,
  selected: [],
  total: 0,
  users: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case USERS_GET_REQUEST:
    case USERS_CREATE_REQUEST:
      return { ...state, error: undefined, loading: true }
    case USERS_GET_SUCCESS: {
      const { append, page, perPage, total, users } = action.payload
      const newState = { ...state }
      if (append) {
        users.forEach(user => {
          const index = newState.users.findIndex(usr => usr.id === user.id)
          if (index === -1) {
            newState.users.push(user)
          } else {
            newState.users.splice(index, 1, user)
          }
        })
      } else {
        newState.users = users
      }
      return { ...newState, page, perPage, total, loading: false }
    }
    case USERS_GET_FAIL:
    case USERS_CREATE_FAIL:
      return { ...state, error: action.error, loading: false }
    case USERS_CREATE_SUCCESS: return { ...state, loading: false }
    case USERS_SELECT: {
      const userId = action.payload
      const selected = state.selected.slice()
      const index = state.selected.indexOf(userId)
      if (index > -1) {
        selected.splice(index, 1)
      } else {
        selected.push(userId)
      }
      return { ...state, selected }
    }
    case USERS_BULK_SELECT:
      return { ...state, selected: action.payload }
    case DIALOGS_CREATE_SUCCESS:
    case DIALOGS_CREATE_CANCEL:
    case DIALOGS_EDIT_CANCEL:
      return {
        ...state,
        filter: initialState.filter,
        selected: initialState.selected
      }
    case USERS_SET_FILTER: return { ...state, filter: action.payload }
    case USERS_SET_PAGE: return { ...state, page: action.payload }
    case AUTH_LOGOUT_SUCCESS: return initialState
    default: return state
  }
}