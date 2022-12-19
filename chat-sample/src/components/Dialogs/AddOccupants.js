import React from 'react';
import {ActivityIndicator, Pressable, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackActions} from '@react-navigation/native';

import UsersFilter from '../Users/Filter';
import UsersList from '../Users/List';
import {
  NOTIFICATION_TYPE_ADDED,
} from '../../constants';
import {
  authUserSelector,
  chatLoadingSelector,
  dialogByIdRouteParamSelector,
  dialogsLoadingSelector,
  messagesSendingSelector,
  usersItemsSelector,
  usersSelectedSelector,
} from '../../selectors';
import {
  dialogCreateCancel,
  dialogEdit,
  messageSend,
} from '../../actionCreators';
import {useActions} from '../../hooks';
import {colors, styles as commonStyles} from '../../theme';
import styles from './styles';
import {showError} from '../../NotificationService';

const selector = createSelector(
  authUserSelector,
  chatLoadingSelector,
  dialogByIdRouteParamSelector,
  dialogsLoadingSelector,
  messagesSendingSelector,
  usersItemsSelector,
  usersSelectedSelector,
  (
    user,
    chatLoading,
    dialog,
    dialogsLoading,
    messagesSending,
    users,
    selectedUsers,
  ) => ({
    currentUser: user,
    dialog,
    loading: chatLoading || dialogsLoading || messagesSending,
    selected: selectedUsers,
    users,
  }),
);

const actions = {
  cancel: dialogCreateCancel,
  sendMessage: messageSend,
  updateDialog: dialogEdit,
};

function AddOccupants(props) {
  const {navigation} = props;
  const {currentUser, dialog, loading, selected, users} = useSelector(state =>
    selector(state, props),
  );
  const { cancel, sendMessage, updateDialog } = useActions(actions);

  const addOccupantsToDialog = React.useCallback(() => {
    if (dialog && selected.length && updateDialog) {
      updateDialog({
        addUsers: selected,
        dialogId: dialog.id,
        reject: action => showError('Failed to update dialog', action.error),
        resolve: () => {
          const myName = currentUser.fullName || currentUser.login;
          const newUsersNames = selected.map(userId => {
            const user = users.find(({ id }) => id === userId);
            return user ? user.fullName || user.login : undefined;
          });
          const newOccupantsIds = selected.join(',');
          const body = `${myName} added ${newUsersNames.join(', ')}`;
          sendMessage({
            body,
            dialogId: dialog.id,
            markable: false,
            properties: {
              notification_type: NOTIFICATION_TYPE_ADDED,
              new_occupants_ids: newOccupantsIds
            },
            reject: errorAction =>
              showError('Failed to send message', errorAction.error),
            resolve: () => navigation.dispatch(
              StackActions.replace('Messages', { dialogId: dialog.id }),
            ),
          });
        },
      });
    }
  }, [
    currentUser,
    dialog,
    navigation,
    selected,
    sendMessage,
    updateDialog,
    users,
  ]);

  React.useEffect(() => () => cancel && cancel(), [cancel]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          disabled={selected.length === 0 || loading}
          onPress={addOccupantsToDialog}
          style={styles.headerButton}>
          {loading ? (
            <ActivityIndicator color={colors.white} size={20} />
          ) : (
            <Text style={styles.headerButtonText}>Done</Text>
          )}
        </Pressable>
      ),
      headerTitle: () => (
        <View style={styles.titleView}>
          <Text style={styles.titleText}>Add Occupants</Text>
          <Text style={styles.titleSmallText}>
            {selected.length} users selected
          </Text>
        </View>
      ),
    });
  }, [addOccupantsToDialog, loading, navigation, selected]);

  const {occupantsIds = []} = dialog;
  return (
    <SafeAreaView edges={['bottom']} style={commonStyles.safeArea}>
      <View style={styles.createScreenContainerView}>
        <UsersFilter />
        <UsersList exclude={occupantsIds} />
      </View>
    </SafeAreaView>
  );
}

export default React.memo(AddOccupants);
