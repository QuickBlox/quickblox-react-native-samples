import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Form, Field} from 'react-final-form';
import {StackActions} from '@react-navigation/native';
import QB from 'quickblox-react-native-sdk';

import FormTextInput from '../FormTextInput';
import {
  NOTIFICATION_TYPE_CREATED,
} from '../../constants';
import {
  authUserSelector,
  dialogsLoadingSelector,
  messagesSendingSelector,
  usersSelectedSelector,
} from '../../selectors';
import {dialogCreate, messageSend} from '../../actionCreators';
import {useActions} from '../../hooks';
import {colors, styles as commonStyles} from '../../theme';
import styles from './styles';
import {showError} from '../../NotificationService';

const selector = createSelector(
  authUserSelector,
  dialogsLoadingSelector,
  messagesSendingSelector,
  usersSelectedSelector,
  (user, dialogsLoading, messagesSending, occupantsIds) => ({
    currentUser: user,
    loading: dialogsLoading || messagesSending,
    occupantsIds,
  }),
);

const actions = {
  createDialog: dialogCreate,
  sendMessage: messageSend,
};

const validate = ({name = ''}) => {
  const errors = {};
  if (!/^.{3,20}$/.test(name)) {
    errors.name = 'Must be in a range from 3 to 20 characters';
  }
  return errors;
};

function DialogsCreate2(props) {
  const {navigation} = props;
  const {currentUser, loading, occupantsIds} = useSelector(selector);
  const {createDialog, sendMessage} = useActions(actions);

  const submitRef = React.useRef();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          disabled={loading}
          onPress={submitRef.current}
          style={styles.headerButton}>
          {loading ? (
            <ActivityIndicator color={colors.white} size={20} />
          ) : (
            <Text style={styles.headerButtonText}>Finish</Text>
          )}
        </TouchableOpacity>
      ),
      headerTitle: () => <Text style={styles.titleText}>New Chat</Text>,
    });
  }, [loading, navigation, submitRef]);

  const renderForm = ({handleSubmit}) => {
    submitRef.current = handleSubmit;
    return (
      <SafeAreaView edges={['bottom']} style={commonStyles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.select({ios: 'padding'})}
          style={styles.createScreenContainerView}>
          <View style={commonStyles.formControlView}>
            <Text style={commonStyles.label}>Chat Name</Text>
            <Field
              activeStyle={commonStyles.textInputActive}
              component={FormTextInput}
              name="name"
              returnKeyType="done"
              style={commonStyles.textInput}
              underlineColorAndroid={colors.transparent}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };

  const submit = ({name}) => {
    const dialogCreateSuccessHandler = action => {
      const dialog = action.payload;
      const myName =
        currentUser.fullName || currentUser.login || currentUser.email;
      const body = `${myName} created the group chat "${name}"`;
      sendMessage({
        body,
        dialogId: dialog.id,
        markable: false,
        properties: {notification_type: NOTIFICATION_TYPE_CREATED},
        reject: sendMessageError =>
          showError(
            'Failed to notify participants about dialog created',
            sendMessageError.error,
          ),
      });
      navigation.dispatch(
        StackActions.replace('Messages', {dialogId: dialog.id}),
      );
    };
    createDialog({
      name,
      occupantsIds,
      reject: action => showError('Failed to create dialog', action.error),
      resolve: dialogCreateSuccessHandler,
      type: QB.chat.DIALOG_TYPE.GROUP_CHAT,
    });
  };

  return <Form render={renderForm} onSubmit={submit} validate={validate} />;
}

export default React.memo(DialogsCreate2);
