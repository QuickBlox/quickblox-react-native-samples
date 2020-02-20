import React from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View  } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { HeaderBackButton } from 'react-navigation-stack'

import HeaderButton from '../HeaderButton'
import DialogsList from '../../containers/Dialogs/List'
import { removePushSubscription, showError } from '../../NotificationService'
import { ADD, INFO, EXIT } from '../../images'
import styles from './styles'
import { colors } from '../../theme'

class Dialogs extends React.Component {

  state = { deleteMode: false }

  static navigationOptions = ({ navigation }) => {
    const cancelDelete = navigation.getParam('cancelDelete')
    const deleteDialogs = navigation.getParam('deleteDialogs')
    const deleteMode = navigation.getParam('deleteMode', false)
    const handleLogout = navigation.getParam('handleLogout')
    const loading = navigation.getParam('loading', false)
    const selected = navigation.getParam('selected', [])
    const userName = navigation.getParam('userName')
    return deleteMode ? {
      headerLeft: (
        <HeaderBackButton onPress={cancelDelete} tintColor="#fff" />
      ),
      headerTitle: (
        <View style={styles.titleView}>
          <Text style={styles.titleText}>Delete Chats</Text>
          <Text style={styles.titleSmallText}>
            {selected.length} chats selected
          </Text>
        </View>
      ),
      headerRight: loading ? (
        <ActivityIndicator color={colors.white} style={{ padding: 8 }} />
      ) : (
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
    const { loading, user } = this.props
    const userName = user ?
     (user.fullName || user.login || user.email) :
     ''
    this.props.navigation.setParams({
      cancelDelete: this.turnDeleteModeOff,
      deleteDialogs: this.deleteDialogs,
      deleteMode: this.state.deleteMode,
      handleLogout: this.logout,
      loading,
      selected: this.props.selected,
      userName,
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { loading, navigation, selected, user } = this.props
    const { deleteMode } = this.state
    if (selected.length !== nextProps.selected.length) {
      navigation.setParams({ selected: nextProps.selected })
    }
    if (loading !== nextProps.loading) {
      navigation.setParams({ loading: nextProps.loading })
    }
    if (user !== nextProps.user) {
      if (user && !nextProps.user) {
        navigation.navigate('CheckAuth')
        return false
      }
    }
    return (
      deleteMode !== nextState.deleteMode ||
      loading !== nextProps.loading ||
      user !== nextProps.user
    )
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
    const { leaveDialog, selected = [] } = this.props
    Promise
      .all(selected.map(dialogId => new Promise((resolve, reject) =>
        leaveDialog({ dialogId, resolve, reject })
      )))
      .then(this.turnDeleteModeOff)
      .catch(action => showError('Failed to leave dialog', action.error))
  }

  logout = () => {
    removePushSubscription().then(this.props.logout)
  }

  goToDialog = dialog => this.props.navigation.navigate({
    routeName: 'Messages',
    params: { dialog },
    key: dialog.id
  })

  render() {
    return (
      <SafeAreaView
        forceInset={{ top: 'never', bottom: 'always' }}
        style={styles.safeArea}
      >
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
