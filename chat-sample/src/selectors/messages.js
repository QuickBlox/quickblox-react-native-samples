import {createSelector} from 'reselect';

const messagesSelector = state => state.messages;

const messagesItemsSelectors = createSelector(
  messagesSelector,
  state => state.messages,
);

export const messagesLoadingSelector = createSelector(
  messagesSelector,
  state => state.loading,
);

export const messagesSendingSelector = createSelector(
  messagesSelector,
  state => state.sending,
);

export const messagesByIdSelector = createSelector(
  messagesItemsSelectors,
  messages => messages.byId,
);

export const messagesItemsByDialogIdSelector = createSelector(
  messagesItemsSelectors,
  (_, props) => props.dialogId,
  (messages, dialogId) =>
    messages.byDialogId[dialogId]
      ? Object.values(messages.byDialogId[dialogId]).filter(
          v => typeof v === 'object',
        )
      : [],
);

export const messagesHasMoreByDialogIdSelector = createSelector(
  messagesItemsSelectors,
  (_, props) => props.dialogId,
  (messages, dialogId) =>
    messages.byDialogId[dialogId]
      ? messages.byDialogId[dialogId].hasMore
      : false,
);

export const messageByIdRouteParamSelector = createSelector(
  messagesByIdSelector,
  (_, props) =>
    props.route && props.route.params && props.route.params.messageId
      ? props.route.params.messageId
      : undefined,
  (byId, messageId) => byId[messageId],
);
