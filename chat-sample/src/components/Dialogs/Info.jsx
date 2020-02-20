import React from 'react'
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-navigation'
import QB from 'quickblox-react-native-sdk'

import User from '../Users/User'
import { colors } from '../../theme'
import { ADD_USER } from '../../images'
import styles from './styles'

const localStyles = StyleSheet.create({
  headerButtonImg: {
    height: 28,
    resizeMode: 'center',
    width: 28,
  },
  list: {
    backgroundColor: colors.whiteBackground,
    height: '100%',
  },
})

export default class DialogInfo extends React.PureComponent {

  focusListener

  static navigationOptions = ({ navigation }) => {
    const dialog = navigation.getParam('dialog', { occupantsIds: [] })
    return {
      headerTitle: (
        <View style={styles.titleView}>
          <Text numberOfLines={1} style={styles.titleText}>
            {dialog.name}
          </Text>
          <Text style={styles.titleSmallText}>
            {dialog.occupantsIds.length} participants
          </Text>
        </View>
      ),
      headerRight: (
        <TouchableOpacity
          onPress={() => navigation.navigate('AddOccupants', { dialog })}
          style={styles.headerButton}
        >
          <Image source={ADD_USER} style={localStyles.headerButtonImg} />
        </TouchableOpacity>
      )
    }
  }

  componentDidMount() {
    const { dialog, navigation } = this.props
    const navDialog = navigation.getParam('dialog', { occupantsIds: [] })
    if (navDialog.occupantsIds.length !== dialog.occupantsIds.length) {
      navigation.setParams({ dialog })
    }
    this.loadMissingUsers()
    this.focusListener = this.props.navigation.addListener(
      'didFocus',
      this.loadMissingUsers
    )
  }

  componentWillUnmount() {
    this.focusListener && this.focusListener.remove()
  }

  loadMissingUsers = () => {
    const { dialog, getUsers, users } = this.props
    const loadUsers = []
    dialog.occupantsIds.forEach(userId => {
      const index = users.findIndex(user => user.id === userId)
      if (index === -1) {
        loadUsers.push(userId)
      }
    })
    if (loadUsers.length) {
      getUsers({
        append: true,
        page: 1,
        perPage: loadUsers.length,
        filter: {
          field: QB.users.USERS_FILTER.FIELD.ID,
          type: QB.users.USERS_FILTER.TYPE.NUMBER,
          operator: QB.users.USERS_FILTER.OPERATOR.IN,
          value: loadUsers.join()
        }
      })
    }
  }

  renderUser = ({ item }) => <User user={item} />

  render() {
    const { data, loading } = this.props
    return (
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={data}
          keyExtractor={({ id }) => `${id}`}
          renderItem={this.renderUser}
          style={localStyles.list}
          refreshing={loading}
        />
      </SafeAreaView>
    )
  }

}