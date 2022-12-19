import React, {useCallback} from 'react';
import {Image, Text, View} from 'react-native';
import QB from 'quickblox-react-native-sdk';
import {CHECKMARK, CHECKMARK_DOUBLE} from '../../../images';
import styles from './styles';

const getDeliveredAndRead = (currentUser, message) => {
  let delivered = false;
  let read = false;
  if (message && currentUser && message.senderId === currentUser.id) {
    const {deliveredIds = [], readIds = [], recipientId} = message;
    if (recipientId && recipientId !== currentUser.id) {
      delivered = deliveredIds.indexOf(recipientId) > -1;
      read = readIds.indexOf(recipientId) > -1;
    } else {
      delivered = deliveredIds.filter(id => id !== currentUser.id).length > 0;
      read = readIds.filter(id => id !== currentUser.id).length > 0;
    }
  }
  return {
    delivered,
    read,
  };
};

function getSentAt(dateSent) {
  const date = new Date(dateSent);
  const minutes = date.getMinutes();
  const minutesString = minutes < 10 ? `0${minutes}` : minutes.toString();
  return `${date.getHours()}:${minutesString}`;
}

function MessageMeta(props) {
  const {
    currentUser,
    message,
    messageIsMine = false,
    sender,
    withAttachment = false,
    dialogType,
  } = props;
  const {delivered, read} = getDeliveredAndRead(currentUser, message);

  const getSentBy = useCallback(() => {
    if (messageIsMine) {
      return 'You';
    } else {
      return sender ? sender.fullName || sender.login || sender.email : '...';
    }
  }, [messageIsMine, sender]);

  const getCheckMarks = useCallback(() => {
    const checkmarkStyle = read ? styles.checkmarkRead : styles.checkmark;
    if (messageIsMine && dialogType !== QB.chat.DIALOG_TYPE.PUBLIC_CHAT) {
      return delivered ? (
        <Image source={CHECKMARK_DOUBLE} style={checkmarkStyle} />
      ) : (
        <Image source={CHECKMARK} style={checkmarkStyle} />
      );
    } else {
      return null;
    }
  }, [delivered, messageIsMine, read]);

  const {dateSent} = message;

  const metaViewStyle = withAttachment
    ? styles.mediaMessageMeta
    : styles.messageMeta;
  return (
    <View style={metaViewStyle}>
      <Text numberOfLines={1} style={styles.messageSender}>
        {getSentBy()}
      </Text>
      <View style={styles.messageMetaSpacer} />
      {getCheckMarks()}
      <Text style={styles.messageSentAt}>{getSentAt(dateSent)}</Text>
    </View>
  );
}

export default React.memo(MessageMeta);
