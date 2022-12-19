import {createSelector} from 'reselect';

import {authUserSelector} from './auth';

const usersSelector = state => state.users;

export const usersItemsSelector = createSelector(
  usersSelector,
  authUserSelector,
  ({users}, currentUser) => users.filter(user => user.id !== currentUser.id),
);

export const usersFilterSelector = createSelector(
  usersSelector,
  users => users.filter,
);

export const usersLoadingSelector = createSelector(
  usersSelector,
  users => users.loading,
);

export const usersSelectedSelector = createSelector(
  usersSelector,
  users => users.selected,
);

export const usersPageSelector = createSelector(
  usersSelector,
  users => users.page,
);

export const usersPerPageSelector = createSelector(
  usersSelector,
  users => users.perPage,
);

export const usersTotalSelector = createSelector(
  usersSelector,
  users => users.total,
);

export const usersItemsExludingIdsSelector = createSelector(
  usersItemsSelector,
  (_, props) => props.exclude,
  (users, excludeIds) =>
    excludeIds && Array.isArray(excludeIds) && excludeIds.length
      ? users.filter(user => !excludeIds.includes(user.id))
      : users,
);
