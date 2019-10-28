import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-navigation'

import UsersFilter from '../../containers/Users/Filter'
import UsersList from '../../containers/Users/List'
import { colors } from '../../theme'
import styles from './styles'

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
    const { navigation, selected } = this.props
    navigation.setParams({ onDonePress: this.updateDialog, selected })
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
      navigation,
      selected = [],
      sendMessage,
      updateDialog,
      users,
    } = this.props
    const dialog = navigation.getParam('dialog')
    if (dialog && selected.length && updateDialog) {
      updateDialog({
        dialogId: dialog.id,
        addUsers: selected
      }).then(result => {
        if (result && result.payload) {
          const myName = currentUser.fullName || currentUser.login
          const newUsersNames = selected.map(userId => {
            const user = users.find(usr => usr.id === userId)
            return user ? (user.fullName || user.login) : undefined
          })
          const body = (
            `${myName} added ${newUsersNames.join(', ')} to the conversation`
          )
          sendMessage({
            dialogId: dialog.id,
            body,
            properties: { notification_type: 2 }
          })
          navigation.navigate('DialogInfo', { dialog: result.payload })
        }
      })
    }
  }

  render() {
    const dialog = this.props.navigation.getParam('dialog', {})
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