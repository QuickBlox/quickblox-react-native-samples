import React from 'react';
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

export default function ViewedBy(props) {
  const {navigation} = props;
  const {loading, message, users} = useSelector(state =>
    selector(state, props),
  );
  const {getUsers} = useActions(actions);

  const data =
    message && message.readIds
      ? message.readIds
          .map(userId => users.find(({id}) => id === userId))
          .filter(Boolean)
      : [];

  React.useEffect(() => {
    if (message) {
      const readIds = message.readIds ? message.readIds : [];
      const loadUsers = readIds.filter(
        userId => users.findIndex(user => user.id === userId) === -1,
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
    }
  }, [message, getUsers, users]);

  React.useLayoutEffect(() => {
    const readIds = message && message.readIds ? message.readIds : [];
    navigation.setOptions({
      headerRight: () => <View style={commonStyles.headerButtonStub} />,
      headerTitle: () => (
        <View style={styles.titleView}>
          <Text style={styles.titleText}>Message viewed by</Text>
          <Text style={styles.titleSmallText}>{readIds.length} members</Text>
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
