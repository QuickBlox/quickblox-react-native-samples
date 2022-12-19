import {createSelector} from 'reselect';

const chatSelector = state => state.chat;

export const chatConnectedSelector = createSelector(
  chatSelector,
  chat => chat.connected,
);

export const chatErrorSelector = createSelector(
  chatSelector,
  chat => chat.error,
);

export const chatLoadingSelector = createSelector(
  chatSelector,
  chat => chat.loading,
);
