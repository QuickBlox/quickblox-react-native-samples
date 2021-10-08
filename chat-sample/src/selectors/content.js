import {createSelector} from 'reselect';

const contentSelector = state => state.content;

export const contentUploadProgressSelector = createSelector(
  contentSelector,
  state => state.uploadProgress,
);

export const contentIsUploadingSelector = createSelector(
  contentSelector,
  state => state.uploading,
);

export const contentFileUrlForMessageOwnPropsSelector = createSelector(
  contentSelector,
  (_, props) =>
    props.message && Array.isArray(props.message.attachments)
      ? props.message.attachments[0]
      : undefined,
  (state, attachment) => (attachment ? state[attachment.id] : undefined),
);
