import React, {useEffect, useMemo, memo, useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import QB from 'quickblox-react-native-sdk';

import {
  authUserSelector,
  dialogsTypingSelector,
  usersItemsSelector,
} from '../selectors';
import {usersGet, dialogUpdateTypingStatus} from '../actionCreators';
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
  dialogTyping: dialogsTypingSelector,
  currentUser: authUserSelector,
  users: usersItemsSelector,
});

const actions = {
  loadUsers: usersGet,
  dialogStoppedTypingUser: dialogUpdateTypingStatus,
};

function getTyping(typingUsersIds, users, currentUser) {
  if (typingUsersIds.length) {
    if (typingUsersIds.length === 1 && typingUsersIds[0] === currentUser.id) {
      return '';
    }
    const userNames = typingUsersIds
      .filter(userId => userId !== currentUser.id)
      .map(userId => {
        const user = users.find(({ id }) => id === parseInt(userId, 10));
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
        return `${userNames[0]}, ${userNames[1]} and ${userNames.length - 2
          } more are typing...`;
    }
  } else {
    return '';
  }
}

function TypingIndicator(props) {
  const { dialogId, style } = props;
  const { loadUsers, dialogStoppedTypingUser } = useActions(actions);
  const { dialogTyping, currentUser, users } = useSelector(state =>
    selector(state, props),
  );
  const [timers, setTimers] = useState({});

  const typingUsersIds = useMemo(() => {
    const arrayOfUserIds = Object.keys(timers);
    return arrayOfUserIds;
  }, [timers]);

  useEffect(() => {
    setTimers((prevTimers) => {
      const timers = { ...prevTimers };

      if (!dialogTyping) {
        const timerList = Object.values(timers);
        if (timerList.length) {
          timerList.forEach(clearTimeout);
        }
        return {};
      }

      const typingUserId = dialogTyping.userId.toString();
      const isTyping = dialogTyping.isTyping;

      if (timers[typingUserId]) {
        const removedTimer = timers[typingUserId];
        clearTimeout(removedTimer);
        delete timers[typingUserId];
      }

      if (isTyping === true) {
        const timerId = setTimeout(() => {
          const params = {
            dialogId: dialogId,
            userId: typingUserId,
            isTyping: false,
          }
          dialogStoppedTypingUser(params);
        }, 6000);
        timers[typingUserId] = timerId;
      }
      return timers;
    });
  }, [dialogId, dialogTyping]);

  useEffect(() => {
    const missingUserIds = typingUsersIds.filter(
      userId =>
        userId !== currentUser.id && !users.some(id => id === parseInt(userId, 10)),
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
  }, [loadUsers, typingUsersIds, currentUser, users]);

  return (
    <Text style={[styles.typingText, style]}>
      {getTyping(typingUsersIds, users, currentUser)}
    </Text>
  );
}

export default memo(TypingIndicator);
