import React from 'react';
import {ActivityIndicator, SectionList, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import QB from 'quickblox-react-native-sdk';

import Message from '../Message';
import SectionHeaderRenderer from './SectionHeaderRenderer';
import TypingIndicator from '../../TypingIndicator';
import useMessagesListProps from './useMessagesListProps';
import {messageMarkRead, messagesGet, usersGet} from '../../../actionCreators';
import {useActions} from '../../../hooks';
import {colors} from '../../../theme';
import styles from '../styles';

const viewabilityConfig = {
  itemVisiblePercentThreshold: 100,
  minimumViewTime: 600,
};

const PER_PAGE = 30;

const actions = {
  getMessages: messagesGet,
  getUsers: usersGet,
  markAsRead: messageMarkRead,
};

export default function MessagesList(props) {
  const {dialogId} = props;
  const {
    currentUser,
    dialogType,
    hasMore,
    loading,
    loadingUsers,
    sections,
    senderIds,
    users,
  } = useMessagesListProps(dialogId);
  const {getMessages, getUsers, markAsRead} = useActions(actions);
  const navigation = useNavigation();
  const [page, setPage] = React.useState(0);

  React.useEffect(() => {
    if (dialogId && getMessages) {
      getMessages({dialogId, limit: PER_PAGE, skip: page * PER_PAGE});
    }
  }, [dialogId, getMessages, page]);

  React.useEffect(() => {
    if (senderIds.length) {
      const missingUsersIds = senderIds.filter(
        userId => users.findIndex(user => user.id === userId) === -1,
      );
      if (missingUsersIds.length && !loadingUsers) {
        getUsers({
          append: true,
          filter: {
            field: QB.users.USERS_FILTER.FIELD.ID,
            operator: QB.users.USERS_FILTER.OPERATOR.IN,
            type: QB.users.USERS_FILTER.TYPE.NUMBER,
            value: missingUsersIds.join(),
          },
        });
      }
    }
  }, [getUsers, loadingUsers, senderIds, users]);

  const loadMore = React.useCallback(() => {
    if (loading || !hasMore) {
      return;
    }
    const nextPage = page + 1;
    getMessages({dialogId, limit: PER_PAGE, skip: nextPage * PER_PAGE});
    setPage(nextPage);
  }, [dialogId, getMessages, hasMore, loading, page]);

  const renderLoadingIndicator = React.useCallback(() => {
    return loading ? (
      <ActivityIndicator color={colors.primary} size={30} />
    ) : null;
  }, [loading]);

  const listEmptyComponent = React.useCallback(() => {
    return loading ? null : (
      <View style={styles.messagesListEmptyView}>
        <Text style={styles.messagesListEmptyText}>
          There is no messages in this chat yet
        </Text>
      </View>
    );
  }, [loading]);

  const forwardTo = messageId => () =>
    navigation.navigate('ForwardTo', {messageId});

  const showDelivered = messageId => () =>
    navigation.navigate('DeliveredTo', {messageId});

  const showViewed = messageId => () =>
    navigation.navigate('ViewedBy', {messageId});

  const renderMessage = ({item: message}) => (
    <Message
      key={message.id}
      message={message}
      onForwardPress={forwardTo(message.id)}
      showDelivered={showDelivered(message.id)}
      showViewed={showViewed(message.id)}
    />
  );

  const viewableItemsChanged =
    dialogType && dialogType !== QB.chat.DIALOG_TYPE.PUBLIC_CHAT
      ? ({changed}) => {
          changed
            .filter(item => item.index !== null)
            .forEach(({isViewable, item: message}) => {
              const {readIds = []} = message;
              const shouldMarkAsRead =
                isViewable && readIds.indexOf(currentUser.id) === -1;
              if (shouldMarkAsRead) {
                markAsRead(message);
              }
            });
        }
      : undefined;

  return (
    <SectionList
      inverted={true}
      ListEmptyComponent={listEmptyComponent}
      ListFooterComponent={renderLoadingIndicator}
      ListHeaderComponent={() => (
        <TypingIndicator dialogId={dialogId} style={styles.typingIndicator} />
      )}
      onEndReached={loadMore}
      onEndReachedThreshold={0.75}
      onViewableItemsChanged={viewableItemsChanged}
      removeClippedSubviews={true}
      renderItem={renderMessage}
      renderSectionFooter={SectionHeaderRenderer}
      sections={sections}
      style={styles.messagesList}
      viewabilityConfig={viewabilityConfig}
    />
  );
}
