import React from 'react';
import {ActivityIndicator, Image, Pressable, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {useNavigation} from '@react-navigation/native';
import {HeaderBackButton} from '@react-navigation/elements';
import QB from 'quickblox-react-native-sdk';

import HeaderButton from '../HeaderButton';
import {
  NOTIFICATION_TYPE_LEAVE,
} from '../../constants';
import {
  authLoadingSelector,
  authUserSelector,
  dialogsItemsSelector,
  dialogsLoadingSelector,
  dialogsSelectedSelector,
  messagesSendingSelector,
} from '../../selectors';
import {
  dialogSelectReset,
  dialogsLeave,
  logoutRequest,
  messageSend,
  removePushSubscriptions,
} from '../../actionCreators';
import {useActions} from '../../hooks';
import {showError} from '../../NotificationService';
import {ADD, INFO, EXIT} from '../../images';
import {colors} from '../../theme';
import styles from './styles';

const selector = createStructuredSelector({
  authLoading: authLoadingSelector,
  dialogs: dialogsItemsSelector,
  loading: dialogsLoadingSelector,
  selected: dialogsSelectedSelector,
  sendingMessage: messagesSendingSelector,
  user: authUserSelector,
});

const actionCreators = {
  leaveDialogs: dialogsLeave,
  logout: logoutRequest,
  removeSubscriptions: removePushSubscriptions,
  resetSelection: dialogSelectReset,
  sendMessage: messageSend,
};

export default function useDialogScreenOptions(
  deleteModeEnabled,
  disableDeleteMode,
) {
  const {authLoading, dialogs, loading, selected, sendingMessage, user} =
    useSelector(selector);
  const {
    leaveDialogs,
    logout,
    removeSubscriptions,
    resetSelection,
    sendMessage,
  } = useActions(actionCreators);
  const navigation = useNavigation();

  const [navigationOptions, setNavigationOptions] = React.useState(null);

  const turnDeleteModeOff = React.useCallback(() => {
    if (!deleteModeEnabled) {
      return;
    }
    resetSelection();
    disableDeleteMode();
  }, [deleteModeEnabled, disableDeleteMode, resetSelection]);

  const goToInfoScreen = () => navigation.navigate('Info');
  const goToCreateDialogScreen = () => navigation.navigate('DialogsCreate1');

  const deleteDialogs = React.useCallback(() => {
    const sendLeaveMessages = Promise.all(
      selected.map(dialogId => {
        const dialog = dialogs.find(({id}) => id === dialogId);
        return dialog && dialog.type === QB.chat.DIALOG_TYPE.GROUP_CHAT
          ? new Promise((resolve, reject) => {
              const username = user
                ? user.fullName || user.login || user.email
                : '';
              const body = `${username} has left`;
              sendMessage({
                body,
                dialogId: dialog.id,
                markable: false,
                properties: {notification_type: NOTIFICATION_TYPE_LEAVE},
                reject,
                resolve,
              });
            })
          : Promise.resolve();
      }),
    );
    sendLeaveMessages
      .then(() => {
        return new Promise((resolve, reject) =>
          leaveDialogs({dialogsIds: selected, reject, resolve}),
        );
      })
      .then(turnDeleteModeOff)
      .catch(action => showError('Failed to leave dialog', action.error));
  }, [dialogs, leaveDialogs, selected, sendMessage, turnDeleteModeOff, user]);

  const signOut = React.useCallback(() => {
    removeSubscriptions({
      reject: () => logout(),
      resolve: () => logout(),
    });
  }, [logout, removeSubscriptions]);

  React.useEffect(() => {
    if (deleteModeEnabled) {
      setNavigationOptions({
        headerLeft: () =>
          loading || sendingMessage ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <HeaderBackButton
              labelVisible={false}
              onPress={turnDeleteModeOff}
              tintColor={colors.white}
            />
          ),
        headerRight: () =>
          loading || sendingMessage ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Pressable onPress={deleteDialogs} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Delete</Text>
            </Pressable>
          ),
        headerTitle: () => (
          <View style={styles.titleView}>
            <Text style={styles.titleText}>Delete Chats</Text>
            <Text style={styles.titleSmallText}>
              {selected.length} chats selected
            </Text>
          </View>
        ),
      });
    } else {
      const userName = user ? user.fullName || user.login || user.email : '';
      setNavigationOptions({
        headerLeft: () => (
          <Pressable
            disabled={authLoading}
            onPress={signOut}
            style={styles.headerButton}>
            {authLoading ? (
              <ActivityIndicator color={colors.white} size={20} />
            ) : (
              <Image
                resizeMode="center"
                source={EXIT}
                style={styles.headerButtonImage}
              />
            )}
          </Pressable>
        ),
        headerRight: () => (
          <View style={styles.headerButtonsView}>
            <HeaderButton imageSource={INFO} onPress={goToInfoScreen} />
            <HeaderButton imageSource={ADD} onPress={goToCreateDialogScreen} />
          </View>
        ),
        headerTitle: () => <Text style={styles.titleText}>{userName}</Text>,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    authLoading,
    deleteModeEnabled,
    loading,
    selected.length,
    sendingMessage,
    user,
  ]);

  return navigationOptions;
}
