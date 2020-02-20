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
    this.props.getUsers({ page: 1, perPage: 30 })
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
    this.props.selectUser(user.id)
    if (this.props.onSelect) {
      this.props.onSelect(user)
    }
  }

  renderUser = ({ item }) => {
    const { selected } = this.props
    let userSelected = false
    if (Array.isArray(selected) && selected.length) {
      userSelected = selected.indexOf(item.id) > -1
    }
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
    const { data, loading } = this.props
    return (
      <FlatList
        contentContainerStyle={{ backgroundColor: colors.white }}
        data={data}
        keyExtractor={({ id }) => `${id}`}
        ListEmptyComponent={this.renderNoUsers}
        onEndReached={this.loadNextPage}
        onEndReachedThreshold={0.85}
        refreshControl={(
          <RefreshControl
            colors={[colors.primary]}
            onRefresh={this.props.getUsers}
            refreshing={loading}
            tintColor={colors.primary}
          />
        )}
        renderItem={this.renderUser}
        renderToHardwareTextureAndroid={Platform.OS === 'android'}
      />
    )
  }

}
