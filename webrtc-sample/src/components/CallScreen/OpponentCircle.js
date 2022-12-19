import React from 'react';
import {Text, View} from 'react-native';
import QB from 'quickblox-react-native-sdk';

import {colors} from '../../theme';
import styles from './styles';

const PeerStateText = {
  [QB.webrtc.RTC_PEER_CONNECTION_STATE.NEW]: 'Calling...',
  [QB.webrtc.RTC_PEER_CONNECTION_STATE.CONNECTED]: 'Connected',
  [QB.webrtc.RTC_PEER_CONNECTION_STATE.DISCONNECTED]: 'Disconnected',
  [QB.webrtc.RTC_PEER_CONNECTION_STATE.FAILED]: 'Failed to connect',
  [QB.webrtc.RTC_PEER_CONNECTION_STATE.CLOSED]: 'Connection closed',
};

export default function OpponentCircle(props) {
  const {peers, style, user} = props;
  const username = user ? user.fullName || user.login || user.email : '';
  const backgroundColor =
    user && user.color ? user.color : colors.primaryDisabled;
  const peerState = user ? peers[user.id] || 0 : 0;
  return (
    <View style={[styles.opponentView, style]}>
      <View style={[styles.circleView, {backgroundColor}]}>
        <Text style={styles.circleText}>{username.charAt(0)}</Text>
      </View>
      <Text style={styles.usernameText}>{username}</Text>
      <Text style={styles.statusText}>{PeerStateText[peerState]}</Text>
    </View>
  );
}
