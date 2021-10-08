import {createSelector} from 'reselect';

const usersSelector = state => state.users;

export const usersItemsSelector = createSelector(
  usersSelector,
  users => users.users,
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
