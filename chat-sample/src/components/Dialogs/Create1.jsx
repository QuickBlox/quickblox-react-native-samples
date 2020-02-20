import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView, StackActions } from 'react-navigation'

import UsersFilter from '../../containers/Users/Filter'
import UsersList from '../../containers/Users/List'
import { showError } from '../../NotificationService'
import { colors } from '../../theme'
import styles from './styles'

const localStyles = StyleSheet.create({
  contentView: {
    flex: 1,
    backgroundColor: colors.whiteBackground,
    width: '100%',
  },
})

export default class DialogsCreate1 extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const selected = navigation.getParam('selected', [])
    const nextPressHandler = navigation.getParam('onCreate')
    return {
      headerTitle: (
        <View style={styles.titleView}>
          <Text style={styles.titleText}>New Chat</Text>
          <Text style={styles.titleSmallText}>
            {selected.length} users selected
          </Text>
        </View>
      ),
      headerRight: (
        <TouchableOpacity
          disabled={selected.length === 0}
          onPress={nextPressHandler}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>
            Create
          </Text>
        </TouchableOpacity>
      )
    }
  }

  componentDidMount() {
    const { navigation, selected } = this.props
    navigation.setParams({ onCreate: this.createHandler, selected })
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

  createHandler = () => {
    const { createDialog, navigation, selected } = this.props
    if (selected.length === 1) {
      new Promise((resolve, reject) => {
        createDialog({ occupantsIds: selected, resolve, reject })
      })
      .then(action => {
        const dialog = action.payload
        const reset = StackActions.replace({
          newKey: dialog.id,
          params: { dialog },
          routeName: 'Messages',
        })
        navigation.dispatch(reset)
      })
      .catch(action => showError('Failed to create dialog', action.error))
    } else {
      navigation.push('DialogsCreate2')
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={localStyles.contentView}>
          <UsersFilter />
          <UsersList />
        </View>
      </SafeAreaView>
    )
  }

}
