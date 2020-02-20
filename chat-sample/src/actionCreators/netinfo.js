import { NETWORK_STATE_CHANGED } from '../constants'

export function networkStateChanged(online) {
  return { type: NETWORK_STATE_CHANGED, payload: online }
}
