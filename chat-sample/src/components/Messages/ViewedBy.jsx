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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  titleView: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  titleText: {
    color: colors.white,
    fontSize: 17,
    lineHeight: 20,
  },
  titleSmallText: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 15,
    opacity: 0.6,
  },
  headerRightButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerRightButtonImg: {
    height: 28,
    resizeMode: 'center',
    width: 28,
  },
  list: {
    backgroundColor: colors.whiteBackground,
    height: '100%',
  },
})

export default class ViewedBy extends React.PureComponent {

  static navigationOptions = ({ navigation }) => {
    const message = navigation.getParam('message', { })
    const { readIds = [] } = message
    return {
      headerTitle: (
        <View style={styles.titleView}>
          <Text style={styles.titleText}>Message viewed by</Text>
          <Text style={styles.titleSmallText}>
            {readIds.length} members
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
    const { readIds = [] } = message
    const loadUsers = []
    readIds.forEach(userId => {
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
      <SafeAreaView style={styles.root}>
        <FlatList
          data={this.props.data}
          keyExtractor={({ id }) => `${id}`}
          renderItem={this.renderUser}
          renderToHardwareTextureAndroid={Platform.OS === 'android'}
          style={styles.list}
        />
      </SafeAreaView>
    )
  }

}