import React, {useCallback, useEffect} from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {SafeAreaView} from 'react-native-safe-area-context';
import {HeaderBackButton} from '@react-navigation/elements';
import QB from 'quickblox-react-native-sdk';
import {CommonActions} from '@react-navigation/native';

import MessagesList from './List';
import MessageInput from './MessageInput';
import MoreMenu from './MoreMenu';
import {authUserSelector, dialogByIdRouteParamSelector} from '../../selectors';
import {dialogsLeave, messageSend, dialogActivate, dialogDeactivate} from '../../actionCreators';
import {useActions} from '../../hooks';
import {styles as commonStyles, colors} from '../../theme';
import styles from './styles';
import {showError} from '../../NotificationService';
import {
  NOTIFICATION_TYPE_LEAVE,
} from '../../constants';

// taken from https://github.com/ptelad/react-native-iphone-x-helper/blob/master/index.js
function isIphoneX() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 780 ||
      dimen.width === 780 ||
      dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 844 ||
      dimen.width === 844 ||
      dimen.height === 896 ||
      dimen.width === 896 ||
      dimen.height === 926 ||
      dimen.width === 926)
  );
}

const keyboardViewProps = Platform.select({
  ios: {
    behavior: 'padding',
    keyboardVerticalOffset: isIphoneX() ? 90 : 64,
  },
});

function getDialogPhoto(dialog = {}) {
  const {color: backgroundColor, name = '', type} = dialog;
  if (type === QB.chat.DIALOG_TYPE.CHAT && name.length) {
    return (
      <View style={[styles.dialogCircle, {backgroundColor}]}>
        <Text style={styles.titleNormalText}>
          {name.charAt(0).toUpperCase()}
        </Text>
      </View>
    );
  } else {
    return null;
  }
}

const selector = createStructuredSelector({
  dialog: dialogByIdRouteParamSelector,
  user: authUserSelector,
});

const actions = {
  leaveDialogs: dialogsLeave,
  sendMessage: messageSend,
  activateDialog: dialogActivate,
  deactivateDialog: dialogDeactivate,
};

export default function MessagesScreen(props) {
  const {navigation, route} = props;
  const {dialog, user} = useSelector(state => selector(state, props));
  const {leaveDialogs, sendMessage, activateDialog, deactivateDialog} = useActions(actions);

  const dialogInfoPressHandler = useCallback(() => {
    const dialogId = dialog ? dialog.id : route.params.dialogId;
    if (dialogId && navigation) {
      navigation.push('DialogInfo', {dialogId});
    }
  }, [dialog, navigation, route.params]);

  const leavePressHandler = useCallback(() => {
    const sendLeaveMessage = new Promise((resolve, reject) => {
      if (!dialog) {
        throw new Error('Dialog parameter is missing');
      }
      if (dialog.type === QB.chat.DIALOG_TYPE.GROUP_CHAT) {
        const username = user ? user.fullName || user.login || user.email : '';
        const body = `${username} has left`;
        sendMessage({
          body,
          dialogId: dialog.id,
          markable: false,
          properties: {notification_type: NOTIFICATION_TYPE_LEAVE},
          reject,
          resolve,
        });
      } else {
        resolve();
      }
    });
    sendLeaveMessage
      .then(
        () =>
          new Promise((resolve, reject) => {
            const {id: dialogId} = dialog;
            if (!dialogId) {
              throw new Error('Dialog Id is missing');
            }
            leaveDialogs({dialogsIds: [dialogId], reject, resolve});
          }),
      )
      .then(() => navigation.popToTop())
      .catch(action => showError('Failed to leave dialog', action.error));
  }, [dialog, leaveDialogs, navigation, sendMessage, user]);

  useEffect(() => {
    const dialogId = dialog ? dialog.id : route.params.dialogId;
    activateDialog(dialogId);
  }, []);

  const goBack = () => {
    deactivateDialog();
    navigation.goBack();
  };

  useEffect(() => {
    const navState = navigation.getState();
    navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
        labelVisible={false}
        onPress={goBack}
        tintColor={colors.white}
      />
      ),

      headerRight: () =>
        dialog && dialog.type !== QB.chat.DIALOG_TYPE.PUBLIC_CHAT ? (
          <MoreMenu
            dialogType={dialog ? dialog.type : 0}
            onInfoPress={dialogInfoPressHandler}
            onLeavePress={leavePressHandler}
          />
        ) : (
          <View style={commonStyles.headerButtonStub} />
        ),
      headerTitle: () => (
        <View style={styles.titleRowView}>
          {getDialogPhoto(dialog)}
          <Text numberOfLines={1} style={styles.titleText}>
            {dialog && dialog.name ? dialog.name : ' '}
          </Text>
        </View>
      ),
    });
    if (navState.routes && navState.routes.length > 2) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [navState.routes[0], navState.routes[navState.index]],
        }),
      );
    }
  }, [dialog, dialogInfoPressHandler, leavePressHandler, navigation]);

  return (
    <SafeAreaView edges={['bottom']} style={commonStyles.safeArea}>
      <KeyboardAvoidingView {...keyboardViewProps} style={styles.keyboardView}>
        <MessagesList dialogId={dialog ? dialog.id : route.params.dialogId} />
        <MessageInput dialogId={dialog ? dialog.id : route.params.dialogId} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
