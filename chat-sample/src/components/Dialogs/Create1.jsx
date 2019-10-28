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
      createDialog({ occupantsIds: selected }).then(result => {
        if (result.error) {
          showError('Failed to create dialog', result.error)
        } else {
          const reset = StackActions.replace({
            newKey: result.dialog.id,
            params: { dialog: result.dialog },
            routeName: 'Messages',
          })
          navigation.dispatch(reset)
        }
      })
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
