import {
  CONNECTION_CHANGED,
  INIT_QB_REQUEST_FAIL,
  INIT_QB_REQUEST_SUCCESS,
} from '../constants'

const initialState = {
  ready: undefined,
  connected: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case INIT_QB_REQUEST_SUCCESS: {
      return { ...state, ready: true }
    }
    case INIT_QB_REQUEST_FAIL: {
      return { ...state, ready: false }
    }
    case CONNECTION_CHANGED:
      return { ...state, connected: action.payload }
    default: return state
  }
}
