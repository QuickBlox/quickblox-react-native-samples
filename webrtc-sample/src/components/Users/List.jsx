import React from 'react'
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import QB from 'quickblox-react-native-sdk'

import User from './User'
import { showError } from '../../NotificationService'
import { colors } from '../../theme'

const styles = StyleSheet.create({
  noUsersView: {
    alignItems: 'center',
    backgroundColor: colors.whiteBackground,
    justifyContent: 'center',
    padding: 25,
  },
  noUsersText: {
    color: colors.label,
    fontSize: 17,
    lineHeight: 20,
  },
})

export default class UsersList extends React.PureComponent {

  componentDidMount() {
    this.props.getUsers()
  }

  loadNextPage = () => {
    const {
      filter,
      getUsers,
      loading,
      page,
      perPage,
      total,
    } = this.props
    const hasMore = page * perPage < total
    if (loading || !hasMore) {
      return
    }
    const query = {
      append: true,
      page: page + 1,
      perPage,
    }
    if (filter && filter.trim().length) {
      query.filter = {
        field: QB.users.USERS_FILTER.FIELD.FULL_NAME,
        operator: QB.users.USERS_FILTER.OPERATOR.IN,
        type: QB.users.USERS_FILTER.TYPE.STRING,
        value: filter
      }
    }
    getUsers(query)
  }

  onUserSelect = (user) => {
    const { selectUser, selected = [] } = this.props
    const index = selected.findIndex(item => item.id === user.id)
    if (index > -1 || selected.length < 3) {
      const username = user.fullName || user.login || user.email
      selectUser({ id: user.id, name: username })
    } else {
      showError(
        'Failed to select user',
        'You can select no more than 3 users'
      )
    }
  }

  renderUser = ({ item }) => {
    const { selected = [] } = this.props
    const userSelected = selected.some(record => record.id === item.id)
    return (
      <User
        isSelected={userSelected}
        onSelect={this.onUserSelect}
        selectable
        user={item}
      />
    )
  }

  renderNoUsers = () => {
    const { filter, loading } = this.props
    if (loading || !filter) {
      return null
    } else return (
      <View style={styles.noUsersView}>
        <Text style={styles.noUsersText}>
          No user with that name
        </Text>
      </View>
    )
  }

  render() {
    const { data, getUsers, loading } = this.props
    return (
      <FlatList
        data={data}
        keyExtractor={({ id }) => `${id}`}
        ListEmptyComponent={this.renderNoUsers}
        onEndReached={this.loadNextPage}
        onEndReachedThreshold={0.85}
        refreshControl={(
          <RefreshControl
            colors={[colors.primary]}
            refreshing={loading}
            tintColor={colors.primary}
            onRefresh={getUsers}
          />
        )}
        renderItem={this.renderUser}
        renderToHardwareTextureAndroid={Platform.OS === 'android'}
        style={{ backgroundColor: colors.whiteBackground }}
      />
    )
  }

}
