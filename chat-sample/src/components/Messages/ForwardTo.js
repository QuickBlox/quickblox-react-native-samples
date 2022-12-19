import React, {useEffect, useLayoutEffect, useCallback} from 'react';
import {Text, Pressable, View} from 'react-native';
import {useSelector} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackActions} from '@react-navigation/native';

import DialogsList from '../Dialogs/List';
import {
  dialogsSelectedSelector,
  messageByIdRouteParamSelector,
  usersItemsSelector,
} from '../../selectors';
import {dialogSelectReset, messageSend} from '../../actionCreators';
import {useActions} from '../../hooks';
import {styles as commonStyles} from '../../theme';
import styles from './styles';

const selector = createStructuredSelector({
  message: messageByIdRouteParamSelector,
  selected: dialogsSelectedSelector,
  users: usersItemsSelector,
});

const actions = {
  cancel: dialogSelectReset,
  sendMessage: messageSend,
};

export default function ForwardTo(props) {
  const {navigation} = props;
  const {message, selected, users} = useSelector(state =>
    selector(state, props),
  );
  const {cancel, sendMessage} = useActions(actions);

  const forwardMessage = useCallback(() => {
    if (!message) {
      return navigation.goBack();
    }
    const {attachments, body} = message;
    const sender = users.find(user => user.id === message.senderId);
    const origin_sender_name = sender
      ? sender.fullName || sender.login || sender.email || sender.phone
      : '';
    const promises = selected.map(
      dialogId =>
        new Promise((resolve, reject) =>
          sendMessage({
            attachments,
            body,
            dialogId,
            markable: true,
            properties: {origin_sender_name},
            reject,
            resolve,
          }),
        ),
    );
    Promise.all(promises).then(() => navigation.dispatch(
      StackActions.replace('Messages', { dialogId: message.dialogId }))
    );
  }, [navigation, message, selected, sendMessage, users]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          disabled={selected.length === 0}
          onPress={forwardMessage}
          style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Send</Text>
        </Pressable>
      ),
      headerTitle: () => (
        <View style={styles.titleView}>
          <Text style={styles.titleText}>Forward to</Text>
          <Text style={styles.titleSmallText}>{selected.length} chat(s)</Text>
        </View>
      ),
    });
  }, [forwardMessage, navigation, selected]);

  useEffect(() => cancel, [cancel]);

  return (
    <SafeAreaView edges={['bottom']} style={commonStyles.safeArea}>
      <View style={styles.list}>
        <DialogsList selectable />
      </View>
    </SafeAreaView>
  );
}
