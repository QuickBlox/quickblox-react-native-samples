import React from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import QB from 'quickblox-react-native-sdk'

import { colors } from '../../theme'
import { SEARCH } from '../../images'

const styles = StyleSheet.create({
  filterView: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.gray,
    elevation: 8,
    flexDirection: 'row',
    paddingHorizontal: 12,
    shadowColor: colors.primaryDisabled,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    zIndex: 1,
  },
  icon: {
    height: 28,
    marginRight: 10,
    resizeMode: 'center',
    width: 28,
  },
  filterInput: {
    color: colors.black,
    flex: 1,
    fontSize: 15,
    lineHeight: 18,
    height: 44,
  },
  resetFilterBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  resetFilterBtnText: {
    color: colors.black,
    fontSize: 28,
    lineHeight: 30,
    textAlign: 'center',
  },
})

export default class Filter extends React.Component {

  typingTimeout = undefined
  FILTER_DEBOUNCE = 500

  filterTextChangeHandler = text => {
    this.props.setFilter(text)
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout)
      this.typingTimeout = undefined
    }
    this.typingTimeout = setTimeout(() => {
      const { filter = '', page } = this.props
      if (filter.trim().length === 0 || filter.trim().length > 2) {
        if (this.props.getUsers) {
          this.props.getUsers({
            filter: filter && filter.trim().length ? {
              field: QB.users.USERS_FILTER.FIELD.FULL_NAME,
              operator: QB.users.USERS_FILTER.OPERATOR.IN,
              type: QB.users.USERS_FILTER.TYPE.STRING,
              value: filter
            } : undefined,
            page: filter && filter.trim().length ? page : 1,
          })
        }
      }
    }, this.FILTER_DEBOUNCE)
  }

  render() {
    const { filter } = this.props
    return (
      <View style={styles.filterView}>
        <Image source={SEARCH} style={styles.icon} />
        <TextInput
          autoCapitalize="none"
          onChangeText={this.filterTextChangeHandler}
          placeholder="Search"
          returnKeyType="search"
          style={styles.filterInput}
          value={filter}
        />
        {filter && filter.trim().length ? (
          <TouchableOpacity
            onPress={() => this.filterTextChangeHandler('')}
            style={styles.resetFilterBtn}
          >
            <Text style={styles.resetFilterBtnText}>&times;</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    )
  }

}