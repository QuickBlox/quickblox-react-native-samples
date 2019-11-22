import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-navigation'

import HeaderButton from '../HeaderButton'
import DialogsList from '../../containers/Dialogs/List'
import { removePushSubscription } from '../../NotificationService'
import { chatUnsubscribe } from '../../thunks'
import { ADD, INFO, EXIT } from '../../images'
import styles from './styles'

class Dialogs extends React.Component {

  state = { deleteMode: false }

  static navigationOptions = ({ navigation }) => {
    const deleteMode = navigation.getParam('deleteMode', false)
    const cancelDelete = navigation.getParam('cancelDelete')
    const deleteDialogs = navigation.getParam('deleteDialogs')
    const selected = navigation.getParam('selected', [])
    const handleLogout = navigation.getParam('handleLogout')
    const userName = navigation.getParam('userName')
    return deleteMode ? {
      headerLeft: (
        <TouchableOpacity
          onPress={cancelDelete}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>Cancel</Text>
        </TouchableOpacity>
      ),
      headerTitle: (
        <View style={styles.titleView}>
          <Text style={styles.titleText}>Delete Chats</Text>
          <Text style={styles.titleSmallText}>
            {selected.length} chats selected
          </Text>
        </View>
      ),
      headerRight: (
        <TouchableOpacity
          onPress={deleteDialogs}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>Delete</Text>
        </TouchableOpacity>
      )
    } : {
      headerLeft: (
        <HeaderButton
          onPress={handleLogout}
          imageSource={EXIT}
        />
      ),
      headerTitle: (
        <View style={styles.titleView}>
          <Text style={styles.titleText}>{userName}</Text>
        </View>
      ),
      headerRight: (
        <React.Fragment>
          <HeaderButton
            imageSource={INFO}
            onPress={() => navigation.navigate('Info')}
          />
          <HeaderButton
            imageSource={ADD}
            onPress={() => navigation.navigate('DialogsCreate1')}
          />
        </React.Fragment>
      )
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      cancelDelete: this.turnDeleteModeOff,
      deleteDialogs: this.deleteDialogs,
      deleteMode: this.state.deleteMode,
      handleLogout: this.logout,
      selected: this.props.selected,
      userName: this.props.userName,
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { navigation, selected } = this.props
    const { deleteMode } = this.state
    if (selected.length !== nextProps.selected.length) {
      navigation.setParams({ selected: nextProps.selected })
    }
    return deleteMode !== nextState.deleteMode
  }

  turnDeleteModeOn = () => {
    if (this.state.deleteMode) return
    this.setState({ deleteMode: true }, () => {
      this.props.navigation.setParams({ deleteMode: true })
    })
  }

  turnDeleteModeOff = () => {
    if (!this.state.deleteMode) return
    this.props.resetSelection()
    this.setState({ deleteMode: false }, () => {
      this.props.navigation.setParams({ deleteMode: false })
    })
  }

  deleteDialogs = () => {
    const { deleteDialog, selected = [] } = this.props
    selected.forEach(dialogId => deleteDialog(dialogId))
    this.turnDeleteModeOff()
  }

  logout = () => {
    chatUnsubscribe()
    removePushSubscription()
      .then(() => this.props.logout())
      .then(() => this.props.disconnectFromChat())
      .then(result => {
        if (!result || !result.error) {
          this.props.navigation.navigate('CheckAuth')
        }
      })
  }

  goToDialog = dialog => this.props.navigation.navigate({
    routeName: 'Messages',
    params: { dialog },
    key: dialog.id
  })

  render() {
    return (
      <SafeAreaView forceInset={{ top: 'never' }} style={styles.safeArea}>
        <DialogsList
          onLongPress={this.turnDeleteModeOn}
          onPress={this.state.deleteMode ? undefined : this.goToDialog}
          selectable={this.state.deleteMode}
        />
      </SafeAreaView>
    )
  }

}

export default Dialogs
