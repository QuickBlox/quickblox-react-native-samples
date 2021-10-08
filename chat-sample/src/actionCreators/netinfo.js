import {NETWORK_STATE_CHANGED} from '../constants';

export function networkStateChanged(online) {
  return {payload: online, type: NETWORK_STATE_CHANGED};
}
