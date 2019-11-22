import {
  DEVICE_UDID_SET,
  DEVICE_UDID_REMOVE,
} from '../constants'

const initialState = {
  udid: undefined
}

export default (state = initialState, action) => {
  switch (action.type) {
    case DEVICE_UDID_SET: return { udid: action.payload }
    case DEVICE_UDID_REMOVE: return initialState
    default: return state
  }
}