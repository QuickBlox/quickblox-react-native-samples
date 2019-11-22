import React from 'react'
import { Text, TouchableWithoutFeedback, View } from 'react-native'

import RemoteImage from '../../RemoteImage'
import RemoteVideo from '../../RemoteVideo'
import styles from './styles'

export default class MessageBody extends React.Component {

  shouldComponentUpdate(nextProps) {
    const { imageUrl } = this.props
    return imageUrl !== nextProps.imageUrl
  }

  getForwardedText = () => {
    const {
      image = false,
      message: { properties },
      messageIsMine = false,
      video = false,
    } = this.props
    const forwarded = (
      properties &&
      properties.originDialogName &&
      properties.originDialogName.length
    )
    if (!forwarded) {
      return null
    }
    let forwardedTextStyle
    let forwardedBoldTextStyle
    if (messageIsMine) {
      if (image || video) {
        forwardedTextStyle = styles.messageForwardedWithAttachmentText
        forwardedBoldTextStyle = styles.messageForwardedBoldText
      } else {
        forwardedTextStyle = styles.myMessageForwardedText
        forwardedBoldTextStyle = styles.myMessageForwardedBoldText
      }
    } else {
      if (image || video) {
        forwardedTextStyle = styles.messageForwardedWithAttachmentText
      } else {
        forwardedTextStyle = styles.messageForwardedText
      }
      forwardedBoldTextStyle = styles.messageForwardedBoldText
    }
    return (
      <View pointerEvents="none">
        <Text numberOfLines={1} style={forwardedTextStyle}>
          Forwarded from&nbsp;
          <Text style={forwardedBoldTextStyle}>
            {properties.originDialogName}
          </Text>
        </Text>
      </View>
    )
  }

  render() {
    const {
      image = false,
      imageUrl,
      message: { body },
      messageIsMine = false,
      onLongPress,
      video = false,
    } = this.props
    const withMediaAttachment = image || video
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
    const Content = () => {
      if (image) {
        return (
          <RemoteImage
            onLongPress={onLongPress}
            resizeMode="cover"
            source={{ uri: imageUrl }}
            style={styles.attachment}
          />
        )
      } else if (video) {
        return (
          <RemoteVideo
            onLongPress={onLongPress}
            resizeMode="cover"
            source={{ uri: imageUrl }}
            style={styles.attachment}
          />
        )
      } else {
        return (
          <View pointerEvents="none">
            <Text style={_styles.text}>
              {body}
            </Text>
          </View>
        )
      }
    }
    const ForwardedText = this.getForwardedText
    return (
      <TouchableWithoutFeedback
        onLongPress={withMediaAttachment ? null : onLongPress}
      >
        <View style={_styles.bodyView}>
          <ForwardedText />
          <Content />
        </View>
      </TouchableWithoutFeedback>
    )
  }

}