import React from 'react';
import {useSelector} from 'react-redux';
import {ActivityIndicator, Image, Pressable, View} from 'react-native';
import {createStructuredSelector} from 'reselect';
import QB from 'quickblox-react-native-sdk';

import SelectedUsers from './SelectedList';
import {showError} from '../../NotificationService';
import {webrtcCall} from '../../actionCreators';
import {
  appConnectedSelector,
  chatConnectedSelector,
  chatLoadingSelector,
  usersSelectedSelector,
} from '../../selectors';
import {useActions} from '../../hooks';
import {CALL, VIDEO_CALL} from '../../images';
import {colors} from '../../theme';
import styles from './styles';

const selector = createStructuredSelector({
  connected: chatConnectedSelector,
  loading: chatLoadingSelector,
  networkConnected: appConnectedSelector,
  users: usersSelectedSelector,
});

const actions = {call: webrtcCall};

export default function SelectedUsersAndCallButtons() {
  const {connected, loading, networkConnected, users} = useSelector(selector);
  const {call} = useActions(actions);

  const getCallHandlerForType = type => () => {
    if (networkConnected) {
      const opponentsIds = users.map(user => user.id);
      call({opponentsIds, type,
         payload: {
        timestamp: Date.now(),
      }});
    } else {
      showError('No internet connection');
    }
  };

  return (
    <View style={styles.selectedUsersView}>
      <SelectedUsers users={users} />
      {connected && !loading ? (
        <Pressable
          android_ripple={{color: colors.primary}}
          disabled={users.length < 1 || users.length > 3}
          onPress={getCallHandlerForType(QB.webrtc.RTC_SESSION_TYPE.AUDIO)}
          style={styles.callButton}>
          <Image source={CALL} style={styles.callButtonIcon} />
        </Pressable>
      ) : null}
      {connected && !loading ? (
        <Pressable
          android_ripple={{color: colors.primary}}
          disabled={users.length < 1 || users.length > 3}
          onPress={getCallHandlerForType(QB.webrtc.RTC_SESSION_TYPE.VIDEO)}
          style={styles.callButton}>
          <Image source={VIDEO_CALL} style={styles.callButtonIcon} />
        </Pressable>
      ) : null}
      {!connected || loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : null}
    </View>
  );
}
