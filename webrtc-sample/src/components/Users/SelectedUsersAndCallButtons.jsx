import React from 'react'
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native'
import QB from 'quickblox-react-native-sdk'

import SelectedUsers from './SelectedList'
import { showError } from '../../NotificationService'
import { CALL, VIDEO_CALL } from '../../images'
import { colors } from '../../theme'

const Button = Platform.select({
  android: ({ children, style, ...props }) => (
    <TouchableNativeFeedback {...props}>
      <View style={style}>
        {children}
      </View>
    </TouchableNativeFeedback>
  ),
  ios: TouchableOpacity,
})

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    backgroundColor: colors.white,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 8,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  icon: {
    height: 28,
    resizeMode: 'center',
    width: 28,
  },
})

export default class SelectedUsersAndCallButtons extends React.PureComponent {

  audioCall = () => {
    const { call, users } = this.props
    const opponentsIds = users.map(user => user.id)
    try {
      call({ opponentsIds, type: QB.webrtc.RTC_SESSION_TYPE.AUDIO })
    } catch (e) {
      showError('Error', e.message)
    }
  }

  videoCall = () => {
    const { call, users } = this.props
    const opponentsIds = users.map(user => user.id)
    try {
      call({ opponentsIds, type: QB.webrtc.RTC_SESSION_TYPE.VIDEO })
    } catch (e) {
      showError('Error', e.message)
    }
  }

  render() {
    const { connected, loading, users } = this.props
    return (
      <View style={styles.view}>
        <SelectedUsers users={users} />
        {connected && !loading ? (
          <Button
            disabled={users.length < 1 || users.length > 3}
            onPress={this.audioCall}
            style={styles.button}
          >
            <Image source={CALL} style={styles.icon} />
          </Button>
        ) : null}
        {connected && !loading ? (
          <Button
            disabled={users.length < 1 || users.length > 3}
            onPress={this.videoCall}
            style={styles.button}
          >
            <Image source={VIDEO_CALL} style={styles.icon} />
          </Button>
        ) : null}
        {!connected || loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : null}
      </View>
    )
  }
 
}
