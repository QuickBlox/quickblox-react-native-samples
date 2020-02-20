import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-navigation'

import DialogsList from '../../containers/Dialogs/List'
import { colors } from '../../theme'
import styles from './styles'

const localStyles = StyleSheet.create({
  contentView: {
    flex: 1,
    backgroundColor: colors.whiteBackground,
    width: '100%',
  },
})

export default class ForwardTo extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const selected = navigation.getParam('selected', [])
    const sendHandler = navigation.getParam('submit')
    return {
      headerTitle: (
        <View style={styles.titleView}>
          <Text style={styles.titleText}>Forward to</Text>
          <Text style={styles.titleSmallText}>
            {selected.length} chat(s)
          </Text>
        </View>
      ),
      headerRight: (
        <TouchableOpacity
          disabled={selected.length === 0}
          onPress={sendHandler}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>
            Send
          </Text>
        </TouchableOpacity>
      )
    }
  }

  componentDidMount() {
    const { navigation, selected } = this.props
    navigation.setParams({
      selected,
      submit: this.forwardMessage
    })
  }

  shouldComponentUpdate(nextProps) {
    const { loading, navigation, selected } = this.props
    if (selected.length !== nextProps.selected.length) {
      navigation.setParams({ selected: nextProps.selected })
    }
    return loading !== nextProps.loading
  }

  forwardMessage = () => {
    const { dialogs, navigation, selected, sendMessage } = this.props
    const message = navigation.getParam('message')
    if (!message) {
      return navigation.goBack()
    }
    const { attachments, body } = message
    const originDialog = dialogs.find(dialog => dialog.id === message.dialogId)
    const promises = selected.map(dialogId => new Promise((resolve, reject) =>
      sendMessage({
        attachments,
        body,
        dialogId,
        properties: {
          originDialogId: message.dialogId,
          originDialogName: originDialog ? originDialog.name : '',
        },
        resolve,
        reject,
      })
    ))
    Promise.all(promises).then(() => navigation.goBack())
  }

  componentWillUnmount() {
    this.props.cancel && this.props.cancel()
  }

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={localStyles.contentView}>
          <DialogsList selectable />
        </View>
      </SafeAreaView>
    )
  }

}
