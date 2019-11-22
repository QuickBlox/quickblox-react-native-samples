import {
  DEVICE_UDID_SET,
  DEVICE_UDID_REMOVE,
} from '../constants'

export function saveUdid(udid) {
  return { type: DEVICE_UDID_SET, payload: udid }
}

export function removeUdid() {
  return { type: DEVICE_UDID_REMOVE }
}