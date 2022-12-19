import React from 'react';
import {useSelector} from 'react-redux';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {createStructuredSelector} from 'reselect';
import QB from 'quickblox-react-native-sdk';

import User from './User';
import {showError} from '../../NotificationService';
import {usersGet, usersSelect} from '../../actionCreators';
import {
  usersFilterSelector,
  usersItemsExludingIdsSelector,
  usersLoadingSelector,
  usersPageSelector,
  usersPerPageSelector,
  usersSelectedSelector,
  usersTotalSelector,
} from '../../selectors';
import {useActions} from '../../hooks';
import {colors} from '../../theme';

const styles = StyleSheet.create({
  noUsersView: {
    alignItems: 'center',
    backgroundColor: colors.whiteBackground,
    justifyContent: 'center',
    padding: 25,
  },
  noUsersText: {
    color: colors.label,
    fontSize: 17,
    lineHeight: 20,
  },
});

const selector = createStructuredSelector({
  data: usersItemsExludingIdsSelector,
  filter: usersFilterSelector,
  loading: usersLoadingSelector,
  page: usersPageSelector,
  perPage: usersPerPageSelector,
  selected: usersSelectedSelector,
  total: usersTotalSelector,
});

const actions = {
  getUsers: usersGet,
  selectUser: usersSelect,
};

function UsersList(props) {
  const {
    data,
    filter,
    loading,
    page,
    perPage,
    selected,
    total,
  } = useSelector(state => selector(state, props))
  const {getUsers, selectUser} = useActions(actions);

  React.useEffect(() => {
    if (!loading) {
      getUsers();
    }
  }, []);

  const loadNextPage = React.useCallback(() => {
    const hasMore = page * perPage < total;
    if (loading || !hasMore) {
      return;
    }
    const query = {
      append: true,
      page: page + 1,
      perPage,
    };
    if (filter && filter.trim().length) {
      query.filter = {
        field: QB.users.USERS_FILTER.FIELD.FULL_NAME,
        operator: QB.users.USERS_FILTER.OPERATOR.IN,
        type: QB.users.USERS_FILTER.TYPE.STRING,
        value: filter,
      };
    }
    getUsers(query);
  }, [filter, getUsers, loading, page, perPage, total]);

  const onUserSelect = React.useCallback(
    user => {
      const index = selected.findIndex(item => item.id === user.id);
      if (index > -1 || selected.length < 3) {
        const username = user.fullName || user.login || user.email;
        selectUser({id: user.id, name: username});
      } else {
        showError(
          'Failed to select user',
          'You can select no more than 3 users',
        );
      }
    },
    [selected, selectUser],
  );

  const renderUser = React.useCallback(
    ({item}) => (
      <User
        isSelected={selected.some(record => record.id === item.id)}
        onSelect={onUserSelect}
        selectable
        user={item}
      />
    ),
    [onUserSelect, selected],
  );

  const renderNoUsers = React.useCallback(
    () =>
      loading || !filter ? null : (
        <View style={styles.noUsersView}>
          <Text style={styles.noUsersText}>No user with that name</Text>
        </View>
      ),
    [filter, loading],
  );

  return (
    <FlatList
      data={data}
      keyExtractor={({id}) => `${id}`}
      ListEmptyComponent={renderNoUsers}
      onEndReached={loadNextPage}
      onEndReachedThreshold={0.85}
      refreshControl={
        <RefreshControl
          colors={[colors.primary]}
          refreshing={loading}
          tintColor={colors.primary}
          onRefresh={getUsers}
        />
      }
      removeClippedSubviews={true}
      renderItem={renderUser}
      renderToHardwareTextureAndroid={Platform.OS === 'android'}
      style={{backgroundColor: colors.whiteBackground}}
    />
  );
}

export default React.memo(UsersList);
