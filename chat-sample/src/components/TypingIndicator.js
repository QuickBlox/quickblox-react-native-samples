import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import QB from 'quickblox-react-native-sdk';

import {
  authUserSelector,
  dialogsItemsSelector,
  usersItemsSelector,
} from '../selectors';
import {usersGet} from '../actionCreators';
import {useActions} from '../hooks';
import {colors} from '../theme';

const styles = StyleSheet.create({
  typingText: {
    backgroundColor: colors.whiteBackground,
    color: colors.gray,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 15,
  },
});

const selector = createStructuredSelector({
  dialogs: dialogsItemsSelector,
  user: authUserSelector,
  users: usersItemsSelector,
});

const actions = {
  loadUsers: usersGet,
};

function getTyping(typingUsersIds, users, currentUser) {
  if (typingUsersIds.length) {
    if (typingUsersIds.length === 1 && typingUsersIds[0] === currentUser.id) {
      return '';
    }
    const userNames = typingUsersIds
      .filter(userId => userId !== currentUser.id)
      .map(userId => {
        const user = users.find(({id}) => id === userId);
        return user ? user.fullName || user.login : undefined;
      })
      .filter(value => value);
    switch (userNames.length) {
      case 0:
        return 'typing...';
      case 1:
        return `${userNames.join()} is typing...`;
      case 2:
        return `${userNames.join(' and ')} are typing...`;
      case 3:
        return `${userNames[0]}, ${userNames[1]} and ${userNames[2]} are typing...`;
      default:
        return `${userNames[0]}, ${userNames[1]} and ${
          userNames.length - 2
        } more are typing...`;
    }
  } else {
    return '';
  }
}

function TypingIndicator(props) {
  const {dialogId, style} = props;
  const {dialogs, user, users} = useSelector(selector);
  const {loadUsers} = useActions(actions);

  const typingUsersIds = React.useMemo(() => {
    const dialog = dialogs.find(({id}) => id === dialogId);
    return dialog && dialog.typing ? dialog.typing : [];
  }, [dialogId, dialogs]);

  React.useEffect(() => {
    const missingUserIds = typingUsersIds.filter(
      userId =>
        userId !== user.id && users.findIndex(({id}) => id === userId) === -1,
    );
    if (missingUserIds.length) {
      loadUsers({
        filter: {
          field: QB.users.USERS_FILTER.FIELD.ID,
          operator: QB.users.USERS_FILTER.OPERATOR.IN,
          type: QB.users.USERS_FILTER.TYPE.NUMBER,
          value: missingUserIds.join(),
        },
        page: 1,
      });
    }
  }, [loadUsers, typingUsersIds, user, users]);

  return (
    <Text style={[styles.typingText, style]}>
      {getTyping(typingUsersIds, users, user)}
    </Text>
  );
}

export default React.memo(TypingIndicator);
