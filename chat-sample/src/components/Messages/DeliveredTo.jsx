import React from 'react'
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-navigation'
import QB from 'quickblox-react-native-sdk'

import User from '../Users/User'
import { colors } from '../../theme'
import styles from './styles'

const localStyles = StyleSheet.create({
  list: {
    backgroundColor: colors.whiteBackground,
    height: '100%',
  },
})

export default class DeliveredTo extends React.PureComponent {

  static navigationOptions = ({ navigation }) => {
    const message = navigation.getParam('message', { })
    const { deliveredIds = [] } = message
    return {
      headerTitle: (
        <View style={styles.titleView}>
          <Text style={styles.titleText}>Message delivered to</Text>
          <Text style={styles.titleSmallText}>
            {deliveredIds.length} members
          </Text>
        </View>
      ),
      headerRight: (
        <View style={{ width: 50 }} />
      )
    }
  }

  componentDidMount() {
    const { message, getUsers, users } = this.props
    const { deliveredIds = [] } = message
    const loadUsers = []
    deliveredIds.forEach(userId => {
      const index = users.findIndex(user => user.id === userId)
      if (index === -1) {
        loadUsers.push(userId)
      }
    })
    if (loadUsers.length) {
      getUsers({
        append: true,
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
    return (
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={this.props.data}
          keyExtractor={({ id }) => `${id}`}
          renderItem={this.renderUser}
          renderToHardwareTextureAndroid={Platform.OS === 'android'}
          style={localStyles.list}
        />
      </SafeAreaView>
    )
  }

}