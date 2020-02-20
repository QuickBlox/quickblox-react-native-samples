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
import { showError } from '../../NotificationService'

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

export default class Messages extends React.Component {

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
    const { dialog, navigation } = this.props
    const navParamDialog = navigation.getParam('dialog', {})
    const navParams = { leaveDialog: this.leaveDialog }
    if (dialog && !this.dialogsEqual(dialog, navParamDialog)) {
      navParams.dialog = dialog
    }
    navigation.setParams(navParams)
  }

  shouldComponentUpdate(nextProps) {
    const { dialog } = this.props
    if (dialog && nextProps.dialog) {
      if (!this.dialogsEqual(dialog, nextProps.dialog)) {
        nextProps.navigation.setParams({ dialog: nextProps.dialog })
        return true
      }
    }
    return false
  }

  dialogsEqual = (dialog1, dialog2) => {
    if ((dialog1 && !dialog2) || (!dialog1 && dialog2)) {
      return false
    }
    const idsEqual = dialog1.id === dialog2.id
    let occupantsEqual = true
    if (dialog1.occupantsIds && dialog2.occupantsIds) {
        if (dialog1.occupantsIds.length === dialog2.occupantsIds.length) {
          occupantsEqual = dialog1.occupantsIds.every(userId =>
            dialog2.occupantsIds.indexOf(userId) > -1
          )
        } else {
          occupantsEqual = false
        }
    }
    const nameEqual = dialog1.name === dialog2.name
    const lastMessageEqual = dialog1.lastMessage === dialog2.lastMessage
    return idsEqual && nameEqual && lastMessageEqual && occupantsEqual
  }

  leaveDialog = () => {
    const { dialog, navigation, leaveDialog } = this.props
    new Promise((resolve, reject) => {
      leaveDialog({ dialogId: dialog.id, resolve, reject })
    })
    .then(() => navigation.navigate('Dialogs'))
    .catch(action => showError('Failed to leave dialog', action.error))
  }

  render() {
    const { dialog, navigation } = this.props
    const { id } = dialog ? dialog : navigation.getParam('dialog', {})
    return (
      <KeyboardAvoidingView
        {...keyboardViewProps}
        style={{ flex: 1 }}
      >
        <SafeAreaView
          forceInset={{ top: 'never', bottom: 'always' }}
          style={styles.safeArea}
        >
          <MessagesList dialogId={id} />
          <MessageInput dialogId={id} />
        </SafeAreaView>
      </KeyboardAvoidingView>
    )
  }

}