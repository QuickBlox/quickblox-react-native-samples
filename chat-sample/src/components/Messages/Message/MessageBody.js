import React from 'react';
import {Text, View} from 'react-native';

import LongPressMenu from '../LongPressMenu';
import Attachment from './Attachment';
import styles from './styles';

function MessageBody(props) {
  const {
    attachmentId,
    attachmentType,
    attachmentUrl,
    dialogType,
    message,
    messageIsMine = false,
    onDeliveredPress,
    onForwardPress,
    onViewedPress,
  } = props;

  const {body = '', properties} = message;
  const withAttachment = React.useRef(Boolean(attachmentType)).current;
  const _styles = messageIsMine
    ? {
        bodyView: withAttachment
          ? styles.myMessageBodyMedia
          : styles.myMessageBodyView,
        text: styles.myMessageBodyText,
      }
    : {
        bodyView: withAttachment
          ? styles.messageBodyMedia
          : styles.messageBodyView,
        text: styles.messageBodyText,
      };

  const deliveredPressHandler = () => {
    if (message && onDeliveredPress) {
      onDeliveredPress(message);
    }
  };
  const forwardPressHandler = () => {
    if (message && onForwardPress) {
      onForwardPress(message);
    }
  };
  const viewedPressHandler = () => {
    if (message && onViewedPress) {
      onViewedPress(message);
    }
  };

  const ForwardedText = () => {
    const forwarded =
      properties &&
      properties.origin_sender_name &&
      properties.origin_sender_name.length;
    if (!forwarded) {
      return null;
    }
    let forwardedTextStyle;
    let forwardedBoldTextStyle;
    if (messageIsMine) {
      forwardedTextStyle = styles.myMessageForwardedText;
      forwardedBoldTextStyle = styles.myMessageForwardedBoldText;
    } else {
      if (withAttachment) {
        forwardedTextStyle = styles.messageForwardedWithAttachmentText;
      } else {
        forwardedTextStyle = styles.messageForwardedText;
      }
      forwardedBoldTextStyle = styles.messageForwardedBoldText;
    }
    return (
      <View pointerEvents="none">
        <Text numberOfLines={1} style={forwardedTextStyle}>
          Forwarded from&nbsp;
          <Text style={forwardedBoldTextStyle}>
            {properties.origin_sender_name}
          </Text>
        </Text>
      </View>
    );
  };

  const Content = React.useCallback(
    ({onLongPress}) => {
      if (withAttachment) {
        return (
          <Attachment
            attachmentType={attachmentType}
            attachmentUrl={attachmentUrl}
            key={attachmentId}
            onLongPress={onLongPress}
          />
        );
      } else {
        return null;
      }
    },
    [attachmentId, attachmentType, attachmentUrl, withAttachment],
  );

  return (
    <View style={_styles.bodyView}>
      <LongPressMenu
        dialogType={dialogType}
        messageIsMine={messageIsMine}
        onDeliveredPress={deliveredPressHandler}
        onForwardPress={forwardPressHandler}
        onViewedPress={viewedPressHandler}
        stickToLeft={!messageIsMine}>
        <ForwardedText />
        <Content />
        {body.length ? <Text style={_styles.text}>{body}</Text> : null}
      </LongPressMenu>
    </View>
  );
}

export default React.memo(MessageBody);
