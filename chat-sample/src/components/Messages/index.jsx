import React from 'react'
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-navigation'
import QB from 'quickblox-react-native-sdk'

import MessagesList from '../../containers/Messages/List'
import MessageInput from '../../containers/Messages/MessageInput'
import MoreMenu from './MoreMenu'
import styles from './styles'

const localStyles = StyleSheet.create({
  titleView: {
    ...styles.titleView,
    flexDirection: 'row',
    paddingHorizontal: 25,
  },
  titleText: {
    ...styles.titleText,
    fontSize: 16,
    fontWeight: 'normal',
  },
  dialogCircle: {
    alignItems: 'center',
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    marginRight: 10,
    width: 28,
  },
})

// taken from https://github.com/ptelad/react-native-iphone-x-helper/blob/master/index.js
const isIphoneX = () => {
  const { height, width } = Dimensions.get('window')
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    ((height === 812 || width === 812) || (height === 896 || width === 896))
  )
}

const keyboardViewProps = Platform.select({
  ios: {
    behavior: 'padding',
    keyboardVerticalOffset: isIphoneX() ? 54 : 64
  }
})

export default class Messages extends React.PureComponent {

  static navigationOptions = ({ navigation }) => {
    const dialog = navigation.getParam('dialog', {})
    const leaveDialog = navigation.getParam('leaveDialog')
    const circleText = dialog.name
      .split(',')
      .filter((str, i) => i < 2 ? str : undefined)
      .reduce((res, val) => res + val.trim().charAt(0).toUpperCase(), '')
    return {
      headerTitle: (
        <View style={localStyles.titleView}>
          {dialog.photo ? (
            <Image
              resizeMode="center"
              source={{ uri: dialog.photo }}
              style={localStyles.dialogCircle}
              borderRadius={80}
            />
          ) : (
            <View style={[localStyles.dialogCircle, { backgroundColor: dialog.color }]}>
              <Text style={localStyles.titleText}>{circleText}</Text>
            </View>
          )}
          <Text numberOfLines={1} style={styles.titleText}>
            {dialog.name}
          </Text>
        </View>
      ),
      headerRight: dialog.type === QB.chat.DIALOG_TYPE.PUBLIC_CHAT ? (
        <View style={{ width: 55 }} />
      ) : (
        <MoreMenu
          dialogType={dialog.type}
          onInfoPress={() => navigation.navigate('DialogInfo', { dialog })}
          onLeavePress={leaveDialog}
        />
      )
    }
  }

  componentDidMount() {
    const { navigation } = this.props
    navigation.setParams({ leaveDialog: this.leaveDialog })
  }

  leaveDialog = () => {
    const { currentUser, navigation, leaveDialog, sendMessage } = this.props
    const dialog = navigation.getParam('dialog', {})
    let leaveMessage
    if (dialog.type === QB.chat.DIALOG_TYPE.CHAT) {
      leaveMessage = Promise.resolve()
    } else {
      const myName = (
        currentUser.fullName || currentUser.login || currentUser.email
      )
      const body = `${myName} left the dialog`
      leaveMessage = sendMessage({
        dialogId: dialog.id,
        body,
        properties: { notification_type: 3 }
      })
    }
    leaveMessage.then(() => leaveDialog(dialog.id)).then(action => {
      if (!action || !action.error) {
        navigation.navigate('Dialogs')
      }
    })
  }

  render() {
    const { id } = this.props.navigation.getParam('dialog', {})
    return (
      <KeyboardAvoidingView
        {...keyboardViewProps}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <MessagesList dialogId={id} />
          <MessageInput dialogId={id} />
        </SafeAreaView>
      </KeyboardAvoidingView>
    )
  }

}