import React from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import QB from 'quickblox-react-native-sdk'

import LongPressMenu from './LongPressMenu'
import RemoteImage from '../RemoteImage'
import RemoteVideo from '../RemoteVideo'
import { colors } from '../../theme'
import { CHECKMARK, CHECKMARK_DOUBLE, SHADOW } from '../../images'

const styles = StyleSheet.create({
  rootView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  messagesList: {
    width: '100%',
  },
  sectionHeaderView: {
    alignItems: 'center',
    backgroundColor: colors.transparent,
    justifyContent: 'center',
  },
  sectionHeaderTextView: {
    backgroundColor: colors.primary,
    borderColor: colors.gray,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 5,
    marginTop: 5,
    padding: 5,
  },
  sectionHeaderText: {
    color: colors.white,
    fontSize: 12,
    textAlign: 'center',
  },
  messageView: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'flex-start',
  },
  myMessageView: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginVertical: 10,
  },
  messageContent: {
    maxWidth: '80%',
  },
  senderCircleView: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginRight: 15,
    width: 40,
  },
  senderCircleText: {
    color: colors.white,
    fontSize: 17,
    lineHeight: 20,
    textAlign: 'center',
  },
  systemMessage: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  messageBodyView: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 22,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    elevation: 2,
    flex: 1,
    paddingVertical: 6,
    shadowColor: colors.inputShadow,
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 0.75,
    shadowRadius: 6,
  },
  myMessageBodyView: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    flex: 1,
    paddingVertical: 6,
    shadowColor: colors.primary,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.75,
    shadowRadius: 4,
  },
  messageMeta: {
    flexDirection: 'row',
    paddingBottom: 5,
    paddingHorizontal: 15,
  },
  mediaMessageMeta: {
    flexDirection: 'row',
    paddingBottom: 5,
    paddingHorizontal: 6,
  },
  messageSender: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 15,
    maxWidth: '85%',
    paddingRight: 6,
  },
  messageSentAt: {
    color: colors.gray,
    fontSize: 13,
    lineHeight: 15,
    paddingLeft: 6,
  },
  messageForwardedText: {
    color: '#687a97',
    fontSize: 13,
    lineHeight: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  messageForwardedBoldText: {
    color: '#687a97',
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 15,
  },
  messageForwardedWithAttachmentText: {
    color: '#687a97',
    fontSize: 13,
    lineHeight: 15,
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  myMessageForwardedText: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  myMessageForwardedBoldText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 15,
  },
  messageBodyText: {
    color: colors.black,
    fontSize: 15,
    lineHeight: 18,
    paddingVertical: 6,
    paddingHorizontal: 15,
  },
  myMessageBodyText: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 18,
    paddingVertical: 6,
    paddingHorizontal: 15,
  },
  messageBodyMedia: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 6,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    minHeight: 250,
    overflow: 'hidden',
    shadowColor: colors.inputShadow,
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 0.75,
    shadowRadius: 6,
    width: 250,
  },
  myMessageBodyMedia: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    minHeight: 250,
    overflow: 'hidden',
    shadowColor: colors.inputShadow,
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 0.75,
    shadowRadius: 6,
    width: 250,
  },
  attachment: {
    height: 250,
    width: 250,
  },
  shadowImg: {
    alignSelf: 'center',
    bottom: -15,
    maxHeight: 40,
    position: 'absolute',
    width: '100%',
    zIndex: -1,
  },
  checkmark: {
    height: 15,
    resizeMode: 'contain',
  },
  checkmarkRead: {
    height: 15,
    resizeMode: 'contain',
    tintColor: colors.primary,
  },
})

const Shadow = Platform.select({
  android: () => (
    <Image
      resizeMode="stretch"
      source={SHADOW}
      style={styles.shadowImg}
    />
  ),
  ios: () => null,
})

export default class Message extends React.Component {

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
      getUsers,
      imageUrl,
      message,
      sender,
    } = this.props
    if ((this.hasImageAttachment || this.hasVideoAttachment) && !imageUrl) {
      const { attachments } = message
      const [attachment] = attachments
      getPrivateUrl(attachment.id)
    }
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

  shouldComponentUpdate(nextProps) {
    const { imageUrl, message, sender } = this.props
    const { deliveredIds = [], readIds = [] } = message
    const {
      deliveredIds: _deliveredIds = [],
      readIds: _readIds = []
    } = nextProps.message
    return (
      deliveredIds.length !== _deliveredIds.length ||
      imageUrl !== nextProps.imageUrl ||
      readIds.length !== _readIds.length ||
      sender !== nextProps.sender
    )
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

  getSentAt = () => {
    const { message: { dateSent } } = this.props
    const date = new Date(dateSent)
    const minutes = date.getMinutes()
    const minutesString = minutes < 10 ? `0${minutes}` : minutes.toString()
    return `${date.getHours()}:${minutesString}`
  }

  getMessageBody = (messageIsMine = false) => {
    const { dialogType, imageUrl, message } = this.props
    const { body, properties } = message
    const withMediaAttachment = (
      this.hasImageAttachment ||
      this.hasVideoAttachment
    )
    const _styles = messageIsMine ? {
      bodyView: withMediaAttachment ?
        styles.myMessageBodyMedia :
        styles.myMessageBodyView,
      text: styles.myMessageBodyText
    } : {
      bodyView: withMediaAttachment ?
        styles.messageBodyMedia :
        styles.messageBodyView,
      text: styles.messageBodyText
    }
    const forwarded = (
      properties &&
      properties.originDialogName &&
      properties.originDialogName.length
    )
    let forwardedTextStyle
    let forwardedBoldTextStyle
    if (messageIsMine) {
      if (withMediaAttachment) {
        forwardedTextStyle = styles.messageForwardedWithAttachmentText
        forwardedBoldTextStyle = styles.messageForwardedBoldText
      } else {
        forwardedTextStyle = styles.myMessageForwardedText
        forwardedBoldTextStyle = styles.myMessageForwardedBoldText
      }
    } else {
      if (withMediaAttachment) {
        forwardedTextStyle = styles.messageForwardedWithAttachmentText
      } else {
        forwardedTextStyle = styles.messageForwardedText
      }
      forwardedBoldTextStyle = styles.messageForwardedBoldText
    }
      styles.myMessageForwardedText
    let msgBody
    if (this.hasImageAttachment) {
      msgBody = onLongPress => (
        <RemoteImage
          onLongPress={onLongPress}
          resizeMode="cover"
          source={{ uri: imageUrl }}
          style={styles.attachment}
        />
      )
    } else if (this.hasVideoAttachment) {
      msgBody = onLongPress => (
        <RemoteVideo
          onLongPress={onLongPress}
          resizeMode="cover"
          source={{ uri: imageUrl }}
          style={styles.attachment}
        />
      )
    } else {
      msgBody = () => (
        <View pointerEvents="none">
          <Text style={_styles.text}>
            {body}
          </Text>
        </View>
      )
    }
    const forwardedText = forwarded ? (
      <View pointerEvents="none">
        <Text numberOfLines={1} style={forwardedTextStyle}>
          Forwarded from&nbsp;
          <Text style={forwardedBoldTextStyle}>
            {properties.originDialogName}
          </Text>
        </Text>
      </View>
    ) : null
    const MessageBody = ({ onLongPress }) => (
      <TouchableWithoutFeedback
        onLongPress={withMediaAttachment ? null : onLongPress}
      >
        <View style={_styles.bodyView}>
          {forwardedText}
          {msgBody(onLongPress)}
        </View>
      </TouchableWithoutFeedback>
    )
    return (
      <LongPressMenu
        dialogType={dialogType}
        onDeliveredPress={this.onDeliveredPress}
        onForwardPress={this.onForwardPress}
        onViewedPress={this.onViewedPress}
        stickToLeft={!messageIsMine}
      >
        <MessageBody />
      </LongPressMenu>
    )
  }

  getMessage = () => {
    const {
      message: { senderId },
      privateChat,
      sender
    } = this.props
    const sentBy = sender ?
      (sender.fullName || sender.login || sender.email) :
      senderId.toString()
    const sentAt = this.getSentAt()
    const circleBackground = sender ? sender.color : colors.primaryDisabled
    const circleText = sentBy
      .split(' ')
      .filter((str, i) => i < 2 ? str : undefined)
      .reduce((res, val) => res + val.trim().charAt(0).toUpperCase(), '')
    const withMediaAttachment = (
      this.hasImageAttachment ||
      this.hasVideoAttachment
    )
    const metaViewStyle = withMediaAttachment ?
      styles.mediaMessageMeta :
      styles.messageMeta
    return (
      <View style={styles.messageView}>
        {privateChat ? null : (
          <View style={[
            styles.senderCircleView,
            { backgroundColor: circleBackground }
          ]}>
            <Text numberOfLines={1} style={styles.senderCircleText}>
              {circleText}
            </Text>
          </View>
        )}
        <View style={styles.messageContent}>
          <View style={metaViewStyle}>
            <Text numberOfLines={1} style={styles.messageSender}>
              {sentBy}
            </Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.messageSentAt}>{sentAt}</Text>
          </View>
          {this.getMessageBody(false)}
        </View>
      </View>
    )
  }

  getMyMessage = () => {
    const { delivered, read } = this.props
    const sentAt = this.getSentAt()
    const withMediaAttachment = (
      this.hasImageAttachment ||
      this.hasVideoAttachment
    )
    const metaViewStyle = withMediaAttachment ?
      styles.mediaMessageMeta :
      styles.messageMeta
    const checkmarkStyle = read ? styles.checkmarkRead : styles.checkmark
    return (
      <View style={styles.myMessageView}>
        <View style={styles.messageContent}>
          <View style={metaViewStyle}>
            <Text numberOfLines={1} style={styles.messageSender}>You</Text>
            <View style={{ flex: 1 }} />
            {delivered ? (
              <Image source={CHECKMARK_DOUBLE} style={checkmarkStyle} />
            ) : (
              <Image source={CHECKMARK} style={checkmarkStyle} />
            )}
            <Text style={styles.messageSentAt}>{sentAt}</Text>
          </View>
          {this.getMessageBody(true)}
          {this.hasImageAttachment || this.hasVideoAttachment ? null : (
            <Shadow />
          )}
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
            <Text style={styles.messageSentAt}>
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