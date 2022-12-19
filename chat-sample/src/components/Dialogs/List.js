import React, { useEffect, useCallback, memo } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import QB from 'quickblox-react-native-sdk';
import {differenceBetweenSets} from '../../utils/utils';

import Dialog from './Dialog';
import {
  dialogsItemsSelector,
  dialogsLimitSelector,
  dialogsLoadingSelector,
  dialogsSelectedSelector,
  dialogsSkipSelector,
  dialogsTotalSelector,
  usersItemsSelector,
} from '../../selectors';
import { dialogGet, dialogSelect, usersGet } from '../../actionCreators';
import { useActions } from '../../hooks';
import styles from './styles';
import { colors } from '../../theme';
import { showError } from '../../NotificationService';

const selector = createStructuredSelector({
  data: dialogsItemsSelector,
  limit: dialogsLimitSelector,
  loading: dialogsLoadingSelector,
  selected: dialogsSelectedSelector,
  skip: dialogsSkipSelector,
  total: dialogsTotalSelector,
  users: usersItemsSelector,
});

const actions = {
  getDialogs: dialogGet,
  selectDialog: dialogSelect,
  getUsers: usersGet,
};

function DialogsList(props) {
  const { onLongPress, onPress, selectable = false } = props;
  const { data, limit, loading, selected, skip, total, users } = useSelector(selector);
  const { getDialogs, selectDialog, getUsers } = useActions(actions);

  const getDialogsHandler = (usersIds) => {
    const savedUsersIds = users && users.length ? new Set(users.map(user => user.id)) : new Set();
    const loadUsersIds = savedUsersIds.size ? differenceBetweenSets(usersIds, savedUsersIds) : usersIds;
    if (loadUsersIds.size) {
      getUsers({
        append: true,
        filter: {
          field: QB.users.USERS_FILTER.FIELD.ID,
          operator: QB.users.USERS_FILTER.OPERATOR.IN,
          type: QB.users.USERS_FILTER.TYPE.NUMBER,
          value: Array.from(loadUsersIds).join(),
        },
      });
    }
  };

  useEffect(() => {
    getDialogs({
      reject: action => showError('Failed to get occupantsIds', action.error),
      resolve: (usersIds) => {
        getDialogsHandler(usersIds);
      }, append: true, limit, skip: 0
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNextPage = useCallback(() => {
    if (loading || skip + limit > total) {
      return;
    }
    getDialogs({
      reject: action => showError('Failed to get occupantsIds', action.error),
      resolve: (usersIds) => {
        getDialogsHandler(usersIds);
      }, append: true, limit, skip: skip + limit
    });
  }, [getDialogs, loading, limit, skip, total]);

  const pressHandler = useCallback(
    dialog => {
      if (onPress) {
        onPress(dialog);
      } else {
        if (selectable && selectDialog) {
          selectDialog(dialog.id);
        }
      }
    },
    [onPress, selectDialog, selectable],
  );

  const longPressHandler = useCallback(
    dialog => onLongPress && onLongPress(dialog),
    [onLongPress],
  );

  const renderDialog = useCallback(
    ({ item }) => {
      const isSelected = selected.length && selected.includes(item.id);
      return (
        <Dialog
          dialog={item}
          onPress={pressHandler}
          onLongPress={longPressHandler}
          selectable={selectable}
          isSelected={isSelected}
        />
      );
    },
    [selected, pressHandler, longPressHandler, selectable],
  );

  return (
    <FlatList
      data={data}
      keyExtractor={({ id }) => id}
      onEndReached={loadNextPage}
      onEndReachedThreshold={0.75}
      refreshControl={
        <RefreshControl
          colors={[colors.primary]}
          onRefresh={() => getDialogs({ limit, skip: 0 })}
          refreshing={loading}
          tintColor={colors.primary}
        />
      }
      renderItem={renderDialog}
      style={styles.dialogsList}
    />
  );
}

export default memo(DialogsList);
