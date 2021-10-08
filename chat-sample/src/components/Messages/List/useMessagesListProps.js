import {useSelector} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {
  authUserSelector,
  dialogsItemsSelector,
  messagesHasMoreByDialogIdSelector,
  messagesItemsByDialogIdSelector,
  messagesLoadingSelector,
  usersItemsSelector,
  usersLoadingSelector,
} from '../../../selectors';

/**
 * @typedef {Object} MessagesSection
 * @property {string} title
 * @property {Array<Message>} data
 */

/**
 * Map messages array into data suitable for SectionList
 * @param {Array} messages
 * @returns {Array<MessagesSection>}
 */
const mapMessagesToSections = (messages = []) =>
  messages
    .sort((a, b) => +b.dateSent - +a.dateSent)
    .reduce((acc, message) => {
      const date = new Date(message.dateSent);
      const section = acc.find(
        ({title}) =>
          title.getDate() === date.getDate() &&
          title.getMonth() === date.getMonth() &&
          title.getFullYear() === date.getFullYear(),
      );
      if (section) {
        section.data.push(message);
      } else {
        acc.push({data: [message], title: date});
      }
      return acc;
    }, []);

const selector = createStructuredSelector({
  currentUser: authUserSelector,
  dialogs: dialogsItemsSelector,
  hasMoreMessaages: messagesHasMoreByDialogIdSelector,
  loading: messagesLoadingSelector,
  loadingUsers: usersLoadingSelector,
  messagesForDialog: messagesItemsByDialogIdSelector,
  users: usersItemsSelector,
});

/**
 * @param {string} dialogId
 */
export default function useMessagesListProps(dialogId) {
  const {
    currentUser,
    dialogs,
    hasMoreMessaages,
    loading,
    loadingUsers,
    messagesForDialog,
    users,
  } = useSelector(state => selector(state, {dialogId}));

  const senderIds = messagesForDialog
    .map(message => message.senderId)
    .filter((userId, index, array) => array.indexOf(userId) === index);
  const dialog =
    dialogs.length && dialogId && dialogs.find(({id}) => id === dialogId);
  return {
    currentUser,
    dialogType: dialog ? dialog.type : undefined,
    hasMore: hasMoreMessaages,
    loading,
    loadingUsers,
    sections: mapMessagesToSections(messagesForDialog),
    senderIds,
    users,
  };
}
