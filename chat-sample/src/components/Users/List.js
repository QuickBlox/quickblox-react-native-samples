import React from 'react';
import {FlatList, RefreshControl, Platform, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import QB from 'quickblox-react-native-sdk';

import User from './User';
import {
  authUserSelector,
  usersFilterSelector,
  usersItemsSelector,
  usersLoadingSelector,
  usersPageSelector,
  usersSelectedSelector,
  usersTotalSelector,
} from '../../selectors';
import {usersGet, usersSelect} from '../../actionCreators';
import {useActions} from '../../hooks';
import {colors} from '../../theme';
import styles from './styles';

const selector = createStructuredSelector({
  filter: usersFilterSelector,
  loading: usersLoadingSelector,
  page: usersPageSelector,
  selected: usersSelectedSelector,
  total: usersTotalSelector,
  user: authUserSelector,
  users: usersItemsSelector,
});

const actions = {
  getUsers: usersGet,
  selectUser: usersSelect,
};

const USERS_PER_PAGE = 30;

export default function UsersList(props) {
  const {exclude = [], onSelect} = props;
  const {filter, loading, page, selected, total, user, users} =
    useSelector(selector);
  const {getUsers, selectUser} = useActions(actions);

  const filteredUsers = users.filter(
    ({id}) => id !== user.id && !exclude.includes(id),
  );

  React.useEffect(() => {
    getUsers({page: 1, perPage: USERS_PER_PAGE});
  }, [getUsers]);

  const loadNextPage = React.useCallback(() => {
    const hasMore = filteredUsers.length < total;
    if (loading || !hasMore) {
      return;
    }
    const query = {
      append: true,
      page: page + 1,
      perPage: USERS_PER_PAGE,
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
  }, [filter, getUsers, loading, page, total, filteredUsers.length]);

  const onUserSelect = React.useCallback(
    item => {
      selectUser(item.id);
      onSelect && onSelect(item);
    },
    [onSelect, selectUser],
  );

  const renderUser = React.useCallback(
    ({item}) => {
      const userIsSelected = selected.length
        ? selected.includes(item.id)
        : false;
      return (
        <User
          isSelected={userIsSelected}
          onSelect={onUserSelect}
          selectable
          user={item}
        />
      );
    },
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
      contentContainerStyle={{backgroundColor: colors.white}}
      data={filteredUsers}
      keyExtractor={({id}) => `${id}`}
      ListEmptyComponent={renderNoUsers}
      onEndReached={loadNextPage}
      onEndReachedThreshold={0.75}
      refreshControl={
        <RefreshControl
          colors={[colors.primary]}
          onRefresh={getUsers}
          refreshing={loading}
          tintColor={colors.primary}
        />
      }
      removeClippedSubviews={true}
      renderItem={renderUser}
      renderToHardwareTextureAndroid={Platform.OS === 'android'}
    />
  );
}
