import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import Checkbox from '../Checkbox'
import { colors } from '../../theme'

const styles = StyleSheet.create({
  userBtn: {
    alignItems: 'center',
    backgroundColor: colors.whiteBackground,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  userBtnSelected: {
    backgroundColor: colors.greyedBlue
  },
  circleView: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginRight: 15,
    width: 40,
  },
  circleText: {
    color: colors.white,
    fontSize: 17,
    lineHeight: 20,
    textAlign: 'center',
  },
  userBtnText: {
    color: colors.black,
    flex: 1,
    fontSize: 17,
    lineHeight: 20,
  },
})

export default class User extends React.PureComponent {

  onUserSelect = () => this.props.onSelect(this.props.user)

  render() {
    const { isSelected, selectable = false, user } = this.props
    const username = user ? (user.fullName || user.login || user.email) : ''
    const btnStyle = isSelected
      ? [styles.userBtn, styles.userBtnSelected]
      : styles.userBtn
    const circleBackground = user ? user.color : colors.primaryDisabled
    const circleText = username.trim().charAt(0).toUpperCase()
    return (
      <TouchableOpacity
        disabled={!selectable}
        onPress={this.onUserSelect}
        style={btnStyle}
      >
        <View style={[styles.circleView, { backgroundColor: circleBackground }]}>
          <Text numberOfLines={1} style={styles.circleText}>
            {circleText}
          </Text>
        </View>
        <Text numberOfLines={1} style={styles.userBtnText}>
          {username}
        </Text>
        {selectable ? (
          <Checkbox checked={isSelected} />
        ) : null}
      </TouchableOpacity>
    )
  }

}