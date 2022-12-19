import React from 'react';
import {Text, View} from 'react-native';
import QB from 'quickblox-react-native-sdk';

import OpponentsCircles from './OpponentsCircles';
import CallScreenButton from '../CallScreenButton';
import styles from './styles';
import Icons from '../../images';
import {colors} from '../../theme';

export default function DialingScreen(props) {
  const {
    caller,
    currentUser,
    isIncomingCall,
    onAcceptPress,
    onEndPress,
    peers,
    session,
    users,
  } = props;
  if (!session) {
    return null;
  }
  const isVideoCall = session.type === QB.webrtc.RTC_SESSION_TYPE.VIDEO;
  const username = caller
    ? caller.fullName || caller.login || caller.phone || caller.email
    : 'Unknown';
  const circleBackground = {
    backgroundColor:
      caller && caller.color ? caller.color : colors.primaryDisabled,
  };
  return (
    <View style={styles.dialingScreenView}>
      {isIncomingCall ? (
        <View style={styles.opponentsContainer}>
          <View style={styles.opponentViewFullWidth}>
            <View style={[styles.circleView, circleBackground]}>
              <Text style={styles.circleText}>{username.charAt(0)}</Text>
            </View>
            <Text numberOfLines={1} style={styles.usernameText}>
              {username}
            </Text>
            <Text style={styles.statusText}>
              {isVideoCall ? 'Video calling' : 'Calling'}...
            </Text>
          </View>
        </View>
      ) : (
        <OpponentsCircles
          currentUser={currentUser}
          peers={peers}
          session={session}
          users={users}
        />
      )}
      <View style={styles.buttons}>
        <CallScreenButton
          buttonStyle={{backgroundColor: colors.redBackground}}
          image={Icons.CALL_END}
          onPress={onEndPress}
          text={isIncomingCall ? 'Decline' : 'End call'}
        />
        {isIncomingCall ? (
          <CallScreenButton
            buttonStyle={{backgroundColor: colors.lightGreen}}
            image={isVideoCall ? Icons.VIDEO_ACCEPT : Icons.CALL_ACCEPT}
            onPress={onAcceptPress}
            text="Accept"
          />
        ) : null}
      </View>
    </View>
  );
}
