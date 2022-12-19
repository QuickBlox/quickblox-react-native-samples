import {createSelector} from 'reselect';

const dialogsSelector = state => state.dialogs;

export const dialogsItemsSelector = createSelector(
  dialogsSelector,
  dialogs => dialogs.dialogs,
);

export const dialogsLimitSelector = createSelector(
  dialogsSelector,
  dialogs => dialogs.limit,
);

export const dialogsLoadingSelector = createSelector(
  dialogsSelector,
  dialogs => dialogs.loading,
);

export const dialogsSelectedSelector = createSelector(
  dialogsSelector,
  dialogs => dialogs.selected,
);

export const dialogsSkipSelector = createSelector(
  dialogsSelector,
  dialogs => dialogs.skip,
);

export const dialogsTotalSelector = createSelector(
  dialogsSelector,
  dialogs => dialogs.total,
);

export const dialogsTypingSelector = createSelector(
  dialogsSelector,
  dialogs => dialogs.dialogTyping,
);

export const dialogByIdRouteParamSelector = createSelector(
  dialogsItemsSelector,
  (_, props) =>
    props.route && props.route.params ? props.route.params.dialogId : undefined,
  (dialogs, dialogId) =>
    dialogId ? dialogs.find(dialog => dialog.id === dialogId) : undefined,
);

export const dialogByIdOwnPropsSelector = createSelector(
  dialogsItemsSelector,
  (_, props) =>
  props ? props.dialogId : undefined,
  (dialogs, dialogId) =>
    dialogId ? dialogs.find(dialog => dialog.id === dialogId) : undefined,
);

export const dialogFromItemOwnPropSelector = createSelector(
  dialogsItemsSelector,
  (_, props) => (props.item ? props.item.dialogId : undefined),
  (dialogs, dialogId) =>
    dialogId ? dialogs.find(({id}) => id === dialogId) : undefined,
);

