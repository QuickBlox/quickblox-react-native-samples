import {createSelector} from 'reselect';

const appSelector = state => state.app;

export const appReadySelector = createSelector(appSelector, app => app.ready);

export const appConnectedSelector = createSelector(
  appSelector,
  app => app.connected,
);
