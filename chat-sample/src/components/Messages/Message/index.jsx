import React from 'react'
import { Text, View } from 'react-native'
import QB from 'quickblox-react-native-sdk'

import LongPressMenu from '../LongPressMenu'
import MessageBody from './MessageBody'
import MessageMeta from '../../../containers/Messages/Message/MessageMeta'
import Shadow from './Shadow'
import { colors } from '../../../theme'
import styles from './styles'

export default class Message extends React.PureComponent {

  hasImageAttachment = false
  hasVideoAttachment = false

  constructor(props) {
    super(props)
    const { attachments } = props.message
    if (Array.isArray(attachments) && attachments.length) {
      const [attachment] = attachments
      if (attachment.type && attachment.type.indexOf('image') > -1) {
        this.hasImageAttachment = true
      }
      if (attachment.type && attachment.type.indexOf('video') > -1) {
        this.hasVideoAttachment = true
      }
    }
  }

  componentDidMount() {
    const {
      getPrivateUrl,
      imageUrl,
      message,
    } = this.props
    if ((this.hasImageAttachment || this.hasVideoAttachment) && !imageUrl) {
      const { attachments } = message
      const [attachment] = attachments
      getPrivateUrl(attachment.id)
    }
  }

  onForwardPress = () => {
    const { message, onForwardPress } = this.props
    if (onForwardPress) {
      onForwardPress(message)
    }
  }

  onDeliveredPress = () => {
    const { message, showDelivered } = this.props
    if (showDelivered) {
      showDelivered(message)
    }
  }

  onViewedPress = () => {
    const { message, showViewed } = this.props
    if (showViewed) {
      showViewed(message)
    }
  }

  getDialogCircle = () => {
    const { dialogType, message, sender } = this.props
    const sentBy = sender ?
      (sender.fullName || sender.login || sender.email) :
      message.senderId.toString()
    const circleBackground = sender ? sender.color : colors.primaryDisabled
    const circleText = sentBy
      .split(' ')
      .filter((str, i) => i < 2 ? str : undefined)
      .reduce((res, val) => res + val.trim().charAt(0).toUpperCase(), '')
    return dialogType === QB.chat.DIALOG_TYPE.CHAT ? null : (
      <View style={[
        styles.senderCircleView,
        { backgroundColor: circleBackground }
      ]}>
        <Text numberOfLines={1} style={styles.senderCircleText}>
          {circleText}
        </Text>
      </View>
    )
  }

  getSentAt = () => {
    const { message: { dateSent } } = this.props
    const date = new Date(dateSent)
    const minutes = date.getMinutes()
    const minutesString = minutes < 10 ? `0${minutes}` : minutes.toString()
    return `${date.getHours()}:${minutesString}`
  }

  getMessage = () => {
    const { dialogType, imageUrl, message } = this.props
    const withMediaAttachment = (
      this.hasImageAttachment ||
      this.hasVideoAttachment
    )
    return (
      <View style={styles.messageView}>
        {this.getDialogCircle()}
        <View style={styles.messageContent}>
          <MessageMeta
            message={message}
            withMediaAttachment={withMediaAttachment}
          />
          <LongPressMenu
            dialogType={dialogType}
            onDeliveredPress={this.onDeliveredPress}
            onForwardPress={this.onForwardPress}
            onViewedPress={this.onViewedPress}
            stickToLeft={true}
          >
            <MessageBody
              dialogType={dialogType}
              image={this.hasImageAttachment}
              imageUrl={imageUrl}
              message={message}
              video={this.hasVideoAttachment}
            />
          </LongPressMenu>
        </View>
      </View>
    )
  }

  getMyMessage = () => {
    const { dialogType, imageUrl, message } = this.props
    const withMediaAttachment = (
      this.hasImageAttachment ||
      this.hasVideoAttachment
    )
    return (
      <View style={styles.myMessageView}>
        <View style={styles.messageContent}>
          <MessageMeta
            message={message}
            messageIsMine={true}
            withMediaAttachment={withMediaAttachment}
          />
          <LongPressMenu
            dialogType={dialogType}
            onDeliveredPress={this.onDeliveredPress}
            onForwardPress={this.onForwardPress}
            onViewedPress={this.onViewedPress}
            stickToLeft={false}
          >
            <MessageBody
              dialogType={dialogType}
              image={this.hasImageAttachment}
              imageUrl={imageUrl}
              message={message}
              messageIsMine={true}
              video={this.hasVideoAttachment}
            />
          </LongPressMenu>
          {withMediaAttachment ? null : <Shadow />}
        </View>
      </View>
    )
  }

  render() {
    const { currentUser, imageUrl, message } = this.props
    const { body, properties = {} } = message
    if ((this.hasImageAttachment || this.hasVideoAttachment) && !imageUrl) {
      return null
    }
    if (['1', '2', '3'].indexOf(properties.notification_type) > -1) {
      return (
        <View style={styles.messageView}>
          <View style={styles.systemMessage}>
            <Text style={[styles.messageSentAt, { textAlign: 'center' }]}>
              {body}
            </Text>
          </View>
        </View>
      )
    }
    if (currentUser && message.senderId === currentUser.id) {
      return this.getMyMessage()
    }
    return this.getMessage()
  }

}