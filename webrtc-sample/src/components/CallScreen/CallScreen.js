import React from 'react';
import {View} from 'react-native';

import VideoViews from './VideoViews';
import CallScreenButtons from './CallScreenButtons';
import styles from './styles';

export default function CallScreen(props) {
  const {
    currentUser,
    displayingUser,
    isLoudspeaker,
    muteAudio,
    muteVideo,
    onCallEndPress,
    onSwitchAudioOutputPress,
    onSwitchCameraPress,
    onToggleAudioPress,
    onToggleVideoPress,
    peers,
    session,
    users,
  } = props;
  return (
    <View style={styles.videosContainer}>
      <VideoViews
        currentUser={currentUser}
        displayingUser={displayingUser}
        muteVideo={muteVideo}
        peers={peers}
        session={session}
        users={users}
      />
      <CallScreenButtons
        isLoudspeaker={isLoudspeaker}
        muteAudio={muteAudio}
        muteVideo={muteVideo}
        onCallEndPress={onCallEndPress}
        onSwitchAudioOutputPress={onSwitchAudioOutputPress}
        onSwitchCameraPress={onSwitchCameraPress}
        onToggleAudioPress={onToggleAudioPress}
        onToggleVideoPress={onToggleVideoPress}
        session={session}
      />
    </View>
  );
}
