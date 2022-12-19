import {createSelector} from 'reselect';

const webrtcSelector = state => state.webrtc;

export const webrtcDisplayingUserSelector = createSelector(
  webrtcSelector,
  state => state.displayingUser
);

export const webrtcLoadingSelector = createSelector(
  webrtcSelector,
  state => state.loading,
);

export const webrtcOnCallSelector = createSelector(
  webrtcSelector,
  state => state.onCall,
);

export const webrtcSessionSelector = createSelector(
  webrtcSelector,
  state => state.session,
);

export const webrtcPeersSelector = createSelector(
  webrtcSelector,
  state => state.peers,
);
