import React from 'react';
import {ActivityIndicator, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import HeaderButton from '../HeaderButton';
import UsersFilter from './Filter';
import SelectedUsersAndCallButtons from './SelectedUsersAndCallButtons';
import UsersList from './List';
import {checkAndRequestPermissions} from '../../PermissionsService';
import {INFO, EXIT} from '../../images';
import {useUsersScreen} from './useUsersScreen';
import styles from './styles';

export default function UsersScreen({navigation}) {
  const {loading, logoutPressHandler, user} = useUsersScreen();

  React.useLayoutEffect(() => {
    const username = user
      ? user.fullName || user.email || user.login || ''
      : '';
    navigation.setOptions({
      headerLeft: () =>
        loading ? (
          <ActivityIndicator color="#ffffff" style={styles.headerLoader} />
        ) : (
          <HeaderButton onPress={logoutPressHandler} imageSource={EXIT} />
        ),
      headerTitle: () => <Text style={styles.titleText}>{username}</Text>,
      headerRight: () =>
        loading ? (
          <ActivityIndicator color="#ffffff" style={styles.headerLoader} />
        ) : (
          <HeaderButton
            imageSource={INFO}
            onPress={() => navigation.navigate('Info')}
          />
        ),
    });
  }, [loading, navigation, logoutPressHandler, user]);

  React.useEffect(() => {
    async function checkPermissionsAndSubscriptions() {
      try {
        await checkAndRequestPermissions();
      } catch (error) {
        __DEV__ && console.log('Request Permissions error: ', error);
      }
    }
    checkPermissionsAndSubscriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <UsersFilter />
      <SelectedUsersAndCallButtons />
      <UsersList />
    </SafeAreaView>
  );
}
