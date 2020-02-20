import {
  INIT_QB_REQUEST_FAIL,
  INIT_QB_REQUEST_SUCCESS,
} from '../constants'

const initialState = {
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
    default: return state
  }
}
