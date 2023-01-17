import {createSelector} from 'reselect';

const appSelector = state => state.app;

export const tokenSelector = createSelector(
    appSelector,
    app => app.token
);
