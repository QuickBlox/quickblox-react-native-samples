import React from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import {useIsFocused} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import QB from 'quickblox-react-native-sdk';

import User from '../Users/User';
import {
  dialogByIdRouteParamSelector,
  usersItemsSelector,
  usersLoadingSelector,
} from '../../selectors';
import {usersGet} from '../../actionCreators';
import {useActions} from '../../hooks';
import {ADD_USER} from '../../images';
import {styles as commonStyles} from '../../theme';
import styles from './styles';

const selector = createSelector(
  dialogByIdRouteParamSelector,
  usersItemsSelector,
  usersLoadingSelector,
  (dialog, users, loading) => {
    const data = dialog
      ? dialog.occupantsIds
          .map(userId => users.find(({id}) => id === userId))
          .filter(Boolean)
      : [];
    return {
      data,
      dialog,
      loading,
      users,
    };
  },
);

const actions = {getUsers: usersGet};

function DialogInfo(props) {
  const {navigation} = props;
  const {data, dialog, loading, users} = useSelector(state =>
    selector(state, props),
  );
  const {getUsers} = useActions(actions);
  const isFocused = useIsFocused();

  React.useEffect(() => {
    const loadUsers = [];
    dialog.occupantsIds.forEach(userId => {
      const index = users.findIndex(user => user.id === userId);
      if (index === -1) {
        loadUsers.push(userId);
      }
    });
    if (loadUsers.length && isFocused) {
      getUsers({
        append: true,
        filter: {
          field: QB.users.USERS_FILTER.FIELD.ID,
          operator: QB.users.USERS_FILTER.OPERATOR.IN,
          type: QB.users.USERS_FILTER.TYPE.NUMBER,
          value: loadUsers.join(),
        },
        page: 1,
        perPage: loadUsers.length,
      });
    }
  }, [dialog, getUsers, isFocused, users]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AddOccupants', {dialogId: dialog.id})
          }
          style={styles.headerButton}>
          <Image source={ADD_USER} style={styles.headerButtonImage} />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <View style={styles.titleView}>
          <Text numberOfLines={1} style={styles.titleText}>
            {dialog.name}
          </Text>
          <Text style={styles.titleSmallText}>
            {dialog.occupantsIds.length} participants
          </Text>
        </View>
      ),
    });
  }, [dialog, navigation]);

  const renderUser = ({item}) => <User user={item} />;

  return (
    <SafeAreaView edges={['bottom']} style={commonStyles.safeArea}>
      <FlatList
        data={data}
        keyExtractor={({id}) => `${id}`}
        renderItem={renderUser}
        style={styles.dialogsList}
        refreshing={loading}
      />
    </SafeAreaView>
  );
}

export default React.memo(DialogInfo);
