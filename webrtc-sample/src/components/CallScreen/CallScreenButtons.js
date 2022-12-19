import React from 'react';
import {View} from 'react-native';
import QB from 'quickblox-react-native-sdk';

import CallScreenButton from '../CallScreenButton';
import Icons from '../../images';
import {colors} from '../../theme';
import styles from './styles';

export default function CallScreenButtons(props) {
  const {
    isLoudspeaker,
    muteAudio,
    muteVideo,
    onCallEndPress,
    onSwitchAudioOutputPress,
    onSwitchCameraPress,
    onToggleAudioPress,
    onToggleVideoPress,
    session,
  } = props;

  return (
    <View style={styles.buttons}>
      <CallScreenButton
        buttonStyle={muteAudio ? styles.buttonActive : undefined}
        image={Icons.MIC_OFF}
        imageStyle={muteAudio ? styles.buttonImageActive : styles.buttonImage}
        onPress={onToggleAudioPress}
        text={muteAudio ? 'Unmute' : 'Mute'}
      />
      {session.type === QB.webrtc.RTC_SESSION_TYPE.VIDEO ? (
        <CallScreenButton
          buttonStyle={muteVideo ? styles.buttonActive : undefined}
          image={Icons.CAM_OFF}
          imageStyle={muteVideo ? styles.buttonImageActive : styles.buttonImage}
          onPress={onToggleVideoPress}
          text={muteVideo ? 'Camera off' : 'Camera on'}
        />
      ) : null}
      {session.type === QB.webrtc.RTC_SESSION_TYPE.VIDEO ? (
        <CallScreenButton
          onPress={onSwitchCameraPress}
          image={Icons.SWITCH_CAMERA}
          text="Swap cam"
        />
      ) : null}
      <CallScreenButton
        buttonStyle={{backgroundColor: colors.redBackground}}
        image={Icons.CALL_END}
        imageStyle={{tintColor: colors.white}}
        onPress={onCallEndPress}
        text="End call"
      />
      {session.type === QB.webrtc.RTC_SESSION_TYPE.AUDIO ? (
        <CallScreenButton
          buttonStyle={isLoudspeaker ? styles.buttonActive : undefined}
          image={Icons.SPEAKER}
          imageStyle={
            isLoudspeaker ? styles.buttonImageActive : styles.buttonImage
          }
          onPress={onSwitchAudioOutputPress}
          text={isLoudspeaker ? 'Speaker' : 'Mic'}
        />
      ) : null}
    </View>
  );
}
