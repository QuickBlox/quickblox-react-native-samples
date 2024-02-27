import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';

import DialingScreen from './DialingScreen';
import CallScreen from './CallScreen';
import {usePrevious} from '../../hooks';
import {useCallScreen} from './useCallScreen';
import styles from './styles';

export default function CallScreenComponent() {
  const {
    acceptCall,
    audioMuted,
    caller,
    currentUser,
    displayingUser,
    endCall,
    isIncomingCall,
    isLoudspeaker,
    loadMissingUsers,
    onCall,
    peers,
    session,
    toggleAudioOutput,
    toggleMuteAudio,
    toggleMuteVideo,
    toggleSwitchCamera,
    users,
    videoMuted,
  } = useCallScreen();

  const prevSession = usePrevious(session);

  React.useEffect(() => {
    if (session && !prevSession) {
      loadMissingUsers();
    }
  }, [session, prevSession]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={styles.container.backgroundColor} />
      {onCall ? (
        <CallScreen
          currentUser={currentUser}
          displayingUser={displayingUser}
          isLoudspeaker={isLoudspeaker}
          muteAudio={audioMuted}
          muteVideo={videoMuted}
          onCallEndPress={endCall}
          onSwitchAudioOutputPress={toggleAudioOutput}
          onSwitchCameraPress={toggleSwitchCamera}
          onToggleAudioPress={toggleMuteAudio}
          onToggleVideoPress={toggleMuteVideo}
          peers={peers}
          session={session}
          users={users}
        />
      ) : (
        <DialingScreen
          caller={caller}
          currentUser={currentUser}
          isIncomingCall={isIncomingCall}
          onAcceptPress={acceptCall}
          onEndPress={endCall}
          peers={peers}
          session={session}
          users={users}
        />
      )}
    </SafeAreaView>
  );
}
