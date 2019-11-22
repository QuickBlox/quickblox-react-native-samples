import React from 'react'
import { Image, Text, View } from 'react-native'
import QB from 'quickblox-react-native-sdk'

import { CHECKMARK, CHECKMARK_DOUBLE } from '../../../images'
import styles from './styles'

export default class MessageMeta extends React.PureComponent {

  componentDidMount() {
    const { getUsers, message, sender } = this.props
    if (!sender && getUsers) {
      getUsers({
        append: true,
        filter: {
          field: QB.users.USERS_FILTER.FIELD.ID,
          type: QB.users.USERS_FILTER.TYPE.NUMBER,
          operator: QB.users.USERS_FILTER.OPERATOR.EQ,
          value: `${message.senderId}`
        }
      })
    }
  }

  getSentAt = () => {
    const { message: { dateSent } } = this.props
    const date = new Date(dateSent)
    const minutes = date.getMinutes()
    const minutesString = minutes < 10 ? `0${minutes}` : minutes.toString()
    return `${date.getHours()}:${minutesString}`
  }

  getSentBy = () => {
    const { message, messageIsMine = false, sender } = this.props
    if (messageIsMine) {
      return 'You'
    } else {
      return sender ?
        (sender.fullName || sender.login || sender.email) :
        message.senderId.toString()
    }
  }

  getCheckMarks = () => {
    const { delivered, messageIsMine = false, read } = this.props
    const checkmarkStyle = read ? styles.checkmarkRead : styles.checkmark
    if (messageIsMine) {
      return delivered ? (
        <Image source={CHECKMARK_DOUBLE} style={checkmarkStyle} />
      ) : (
        <Image source={CHECKMARK} style={checkmarkStyle} />
      )
    } else {
      return null
    }
  }

  render() {
    const { withMediaAttachment = false } = this.props
    const metaViewStyle = withMediaAttachment ?
      styles.mediaMessageMeta :
      styles.messageMeta
    return (
      <View style={metaViewStyle}>
        <Text numberOfLines={1} style={styles.messageSender}>
          {this.getSentBy()}
        </Text>
        <View style={{ flex: 1 }} />
        {this.getCheckMarks()}
        <Text style={styles.messageSentAt}>
          {this.getSentAt()}
        </Text>
      </View>
    )
  }

}