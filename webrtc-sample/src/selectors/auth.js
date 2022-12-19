import {createSelector} from 'reselect';

const authSelector = state => state.auth;

export const authUserSelector = createSelector(authSelector, auth => auth.user);

export const authLoadingSelector = createSelector(
  authSelector,
  auth => auth.loading,
);

export const authLoggedInSelector = createSelector(
  authSelector,
  auth => auth.loggedIn,
);
