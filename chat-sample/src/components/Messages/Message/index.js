import React from 'react';
import {Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import QB from 'quickblox-react-native-sdk';

import MessageBody from './MessageBody';
import MessageMeta from './MessageMeta';
import Shadow from './Shadow';
import {
  authUserSelector,
  contentFileUrlForMessageOwnPropsSelector,
  dialogsItemsSelector,
  usersItemsSelector,
} from '../../../selectors';
import {privateUrlGet} from '../../../actionCreators';
import {useActions} from '../../../hooks';
import {colors} from '../../../theme';
import styles from './styles';

import {
  NOTIFICATION_TYPE_CREATED,
  NOTIFICATION_TYPE_ADDED,
  NOTIFICATION_TYPE_LEAVE,
} from '../../../constants';

const selector = createSelector(
  authUserSelector,
  contentFileUrlForMessageOwnPropsSelector,
  dialogsItemsSelector,
  usersItemsSelector,
  (_, props) => props.message,
  (currentUser, attachmentUrl, dialogs, users, message) => {
    const dialog = dialogs.find(d => d.id === message.dialogId);
    return {
      attachmentUrl,
      currentUser,
      dialogType: dialog ? dialog.type : undefined,
      sender: users.find(user => user.id === message.senderId),
    };
  },
);

const actions = {getPrivateUrl: privateUrlGet};

const HOUR = 1000 * 60 * 60;

function Message(props) {
  const {message, onForwardPress, showDelivered, showViewed} = props;
  const {currentUser, dialogType, attachmentUrl, sender} = useSelector(state =>
    selector(state, props),
  );
  const {getPrivateUrl} = useActions(actions);

  const hasAttachment = React.useRef(false);
  const attachmentType = React.useRef(null);
  const attachmentId = React.useRef('');

  if (Array.isArray(message.attachments) && message.attachments.length) {
    const [attachment] = message.attachments;
    attachmentId.current = attachment.id;
    if (attachment.type && attachment.type.indexOf('image') > -1) {
      attachmentType.current = 'image';
    } else if (attachment.type && attachment.type.indexOf('video') > -1) {
      attachmentType.current = 'video';
    } else {
      attachmentType.current = 'file';
    }
  }

  React.useEffect(() => {
    if (Array.isArray(message.attachments) && message.attachments.length) {
      hasAttachment.current = true;
    }
    if (
      hasAttachment.current &&
      (!attachmentUrl || Date.now() - HOUR * 2 > attachmentUrl.obtained)
    ) {
      const {attachments} = message;
      const [attachment] = attachments;
      getPrivateUrl(attachment.id);
    }
  }, [getPrivateUrl, attachmentUrl, message]);

  const getDialogCircle = React.useCallback(() => {
    const sentBy = sender && (sender.fullName || sender.login || sender.email);
    const circleBackground = sender ? sender.color : colors.primaryDisabled;
    const circleText = sentBy
      ? sentBy
          .split(' ')
          .filter((str, i) => (i < 2 ? str : undefined))
          .reduce((res, val) => res + val.trim().charAt(0).toUpperCase(), '')
      : ' ';
    return dialogType === QB.chat.DIALOG_TYPE.CHAT ? null : (
      <View
        style={[styles.senderCircleView, {backgroundColor: circleBackground}]}>
        <Text numberOfLines={1} style={styles.senderCircleText}>
          {circleText}
        </Text>
      </View>
    );
  }, [dialogType, sender]);

  const getMessage = React.useCallback(() => {
    return (
      <View style={styles.messageView}>
        {getDialogCircle()}
        <View style={styles.messageContent}>
          <MessageMeta
            currentUser={currentUser}
            message={message}
            sender={sender}
            withAttachment={hasAttachment.current}
          />
          <MessageBody
            attachmentId={attachmentId.current}
            attachmentType={attachmentType.current}
            attachmentUrl={attachmentUrl}
            dialogType={dialogType}
            message={message}
            onDeliveredPress={showDelivered}
            onForwardPress={onForwardPress}
            onViewedPress={showViewed}
          />
        </View>
      </View>
    );
  }, [
    attachmentUrl,
    currentUser,
    dialogType,
    getDialogCircle,
    message,
    onForwardPress,
    sender,
    showDelivered,
    showViewed,
  ]);

  const getMyMessage = React.useCallback(() => {
    return (
      <View style={styles.myMessageView}>
        <View style={styles.messageContent}>
          <MessageMeta
            currentUser={currentUser}
            message={message}
            messageIsMine={true}
            withAttachment={hasAttachment.current}
            dialogType={dialogType}
          />
          <MessageBody
            attachmentId={attachmentId.current}
            attachmentType={attachmentType.current}
            attachmentUrl={attachmentUrl}
            dialogType={dialogType}
            message={message}
            messageIsMine={true}
            onDeliveredPress={showDelivered}
            onForwardPress={onForwardPress}
            onViewedPress={showViewed}
          />
          <Shadow />
        </View>
      </View>
    );
  }, [
    attachmentUrl,
    currentUser,
    dialogType,
    message,
    onForwardPress,
    showDelivered,
    showViewed,
  ]);

  const { body, properties = {} } = message;

  const allNotify = [NOTIFICATION_TYPE_CREATED, NOTIFICATION_TYPE_ADDED, NOTIFICATION_TYPE_LEAVE];
  const haveNotificationType = allNotify.includes(properties.notification_type);
  if (haveNotificationType) {
    return (
      <View style={styles.messageView}>
        <View style={styles.systemMessage}>
          <Text style={[styles.messageSentAt, styles.alignCenter]}>{body}</Text>
        </View>
      </View>
    );
  }

  if (currentUser && message.senderId === currentUser.id) {
    return getMyMessage();
  } else {
    return getMessage();
  }
}

export default React.memo(Message);
