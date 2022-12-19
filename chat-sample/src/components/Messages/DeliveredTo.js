import React, {useEffect, useLayoutEffect} from 'react';
import {FlatList, Platform, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {SafeAreaView} from 'react-native-safe-area-context';
import QB from 'quickblox-react-native-sdk';

import User from '../Users/User';
import {
  messageByIdRouteParamSelector,
  usersItemsSelector,
  usersLoadingSelector,
} from '../../selectors';
import {usersGet} from '../../actionCreators';
import {useActions} from '../../hooks';
import {styles as commonStyles} from '../../theme';
import styles from './styles';

const selector = createStructuredSelector({
  loading: usersLoadingSelector,
  message: messageByIdRouteParamSelector,
  users: usersItemsSelector,
});

const actions = {getUsers: usersGet};

export default function DeliveredTo(props) {
  const {navigation} = props;
  const { message, loading, users } = useSelector(state =>
    selector(state, props),
  );
  const { getUsers } = useActions(actions);

  const data =
    message && message.deliveredIds
      ? message.deliveredIds
        .map(userId => users.find(({ id }) => id === userId
         && id !== message.senderId))
        .filter(Boolean)
      : [];

  useEffect(() => {
    const deliveredIds =
      message && message.deliveredIds ? message.deliveredIds : [];
    const loadUsers = deliveredIds.filter(
      userId => users.findIndex(user => user.id === userId
         && user.id !== message.senderId) === -1,
    );
    if (loadUsers.length) {
      getUsers({
        append: true,
        filter: {
          field: QB.users.USERS_FILTER.FIELD.ID,
          operator: QB.users.USERS_FILTER.OPERATOR.IN,
          type: QB.users.USERS_FILTER.TYPE.NUMBER,
          value: loadUsers.join(),
        },
      });
    }
  }, [getUsers, message, users]);

  useLayoutEffect(() => {
    const deliveredIds =
      message && message.deliveredIds ? message.deliveredIds
      .filter((id) => id !== message.senderId) : [];
    navigation.setOptions({
      headerRight: () => <View style={commonStyles.headerButtonStub} />,
      headerTitle: () => (
        <View style={styles.titleView}>
          <Text style={styles.titleText}>Message delivered to</Text>
          <Text style={styles.titleSmallText}>
            {deliveredIds.length} members
          </Text>
        </View>
      ),
    });
  }, [message, navigation]);

  const renderUser = ({item}) => <User user={item} />;

  return (
    <SafeAreaView edges={['bottom']} style={commonStyles.safeArea}>
      <FlatList
        data={data}
        keyExtractor={({id}) => `${id}`}
        refreshing={loading}
        renderItem={renderUser}
        renderToHardwareTextureAndroid={Platform.OS === 'android'}
        style={styles.list}
      />
    </SafeAreaView>
  );
}
