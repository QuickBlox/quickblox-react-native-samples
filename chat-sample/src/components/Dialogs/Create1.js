import React from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackActions} from '@react-navigation/native';
import QB from 'quickblox-react-native-sdk';

import UsersFilter from '../Users/Filter';
import UsersList from '../Users/List';
import {showError} from '../../NotificationService';
import {
  chatLoadingSelector,
  dialogsLoadingSelector,
  messagesSendingSelector,
  usersSelectedSelector,
} from '../../selectors';
import {dialogCreate, dialogCreateCancel} from '../../actionCreators';
import {useActions} from '../../hooks';
import {colors, styles as commonStyles} from '../../theme';
import styles from './styles';

const selector = createSelector(
  chatLoadingSelector,
  dialogsLoadingSelector,
  messagesSendingSelector,
  usersSelectedSelector,
  (chatLoading, dialogsLoading, messagesSending, usersSelected) => ({
    loading: chatLoading || dialogsLoading || messagesSending,
    selected: usersSelected,
  }),
);

const actions = {
  cancel: dialogCreateCancel,
  createDialog: dialogCreate,
};

function DialogsCreate1(props) {
  const {navigation} = props;
  const {loading, selected} = useSelector(selector);
  const {cancel, createDialog} = useActions(actions);

  React.useEffect(() => cancel, [cancel]);

  const createHandler = React.useCallback(() => {
    if (selected.length === 1) {
      createDialog({
        occupantsIds: selected,
        reject: action => showError('Failed to create dialog', action.error),
        resolve: action => {
          const dialog = action.payload;
          navigation.dispatch(
            StackActions.replace('Messages', {dialogId: dialog.id}),
          );
        },
        type: QB.chat.DIALOG_TYPE.CHAT,
      });
    } else {
      navigation.navigate('DialogsCreate2');
    }
  }, [createDialog, navigation, selected]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          disabled={selected.length === 0 || loading}
          onPress={createHandler}
          style={styles.headerButton}>
          {loading ? (
            <ActivityIndicator color={colors.white} size={20} />
          ) : (
            <Text style={styles.headerButtonText}>Create</Text>
          )}
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <View style={styles.titleView}>
          <Text style={styles.titleText}>New Chat</Text>
          <Text style={styles.titleSmallText}>
            {selected.length} users selected
          </Text>
        </View>
      ),
    });
  }, [createHandler, loading, navigation, selected]);

  return (
    <SafeAreaView edges={['bottom']} style={commonStyles.safeArea}>
      <View style={styles.createScreenContainerView}>
        <UsersFilter />
        <UsersList />
      </View>
    </SafeAreaView>
  );
}

export default React.memo(DialogsCreate1);
