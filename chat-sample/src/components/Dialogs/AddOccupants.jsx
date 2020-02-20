import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-navigation'

import UsersFilter from '../../containers/Users/Filter'
import UsersList from '../../containers/Users/List'
import { colors } from '../../theme'
import styles from './styles'
import { showError } from '../../NotificationService'

const localStyles = StyleSheet.create({
  contentView: {
    flex: 1,
    backgroundColor: colors.whiteBackground,
    width: '100%',
  },
})

export default class AddOccupants extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const selected = navigation.getParam('selected', [])
    const onDonePress = navigation.getParam('onDonePress')
    return {
      headerTitle: (
        <View style={styles.titleView}>
          <Text style={styles.titleText}>Add Occupants</Text>
          <Text style={styles.titleSmallText}>
            {selected.length} users selected
          </Text>
        </View>
      ),
      headerRight: (
        <TouchableOpacity
          disabled={selected.length === 0}
          onPress={onDonePress}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>
            Done
          </Text>
        </TouchableOpacity>
      )
    }
  }

  componentDidMount() {
    const { dialog, navigation, selected } = this.props
    const dialogParam = navigation.getParam('dialog', { occupantsIds: [] })
    const navParams = { onDonePress: this.updateDialog, selected }
    if (dialog.occupantsIds.length !== dialogParam.occupantsIds.length) {
      navParams.dialog = dialog
    }
    navigation.setParams(navParams)
  }

  shouldComponentUpdate(nextProps) {
    const { navigation, selected } = this.props
    if (selected.length !== nextProps.selected.length) {
      navigation.setParams({ selected: nextProps.selected })
    }
    return false
  }

  componentWillUnmount() {
    this.props.cancel && this.props.cancel()
  }

  updateDialog = () => {
    const {
      currentUser,
      dialog,
      navigation,
      selected = [],
      sendMessage,
      updateDialog,
      users,
    } = this.props
    if (dialog && selected.length && updateDialog) {
      new Promise((resolve, reject) => updateDialog({
        dialogId: dialog.id,
        addUsers: selected,
        resolve,
        reject,
      }))
      .then(action => {
        const myName = currentUser.fullName || currentUser.login
        const newUsersNames = selected.map(userId => {
          const user = users.find(usr => usr.id === userId)
          return user ? (user.fullName || user.login) : undefined
        })
        const body = (
          `${myName} added ${newUsersNames.join(', ')} to the conversation`
        )
        new Promise((resolve, reject) => {
          sendMessage({
            dialogId: dialog.id,
            body,
            properties: { notification_type: 2 },
            resolve,
            reject,
          })
        })
        .then(() => navigation.navigate(
          'DialogInfo',
          { dialog: action.payload }
        ))
        .catch(action => showError('Failed to send message', action.error))
      })
      .catch(action => showError('Failed to update dialog', action.error))
    }
  }

  render() {
    const { dialog } = this.props
    const { occupantsIds = [] } = dialog
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={localStyles.contentView}>
          <UsersFilter />
          <UsersList exclude={occupantsIds} />
        </View>
      </SafeAreaView>
    )
  }

}