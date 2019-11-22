import {
  INIT_QB_REQUEST_FAIL,
  INIT_QB_REQUEST_SUCCESS,
  CONNECTION_STATE_CHANGE,
} from '../constants'

const initialState = {
  online: true,
  ready: undefined
}

export default (state = initialState, action) => {
  switch (action.type) {
    case INIT_QB_REQUEST_SUCCESS: {
      return { ...state, ready: true }
    }
    case INIT_QB_REQUEST_FAIL: {
      return { ...state, ready: false }
    }
    case CONNECTION_STATE_CHANGE:
      return { ...state, online: action.payload }
    default: return state
  }
}
