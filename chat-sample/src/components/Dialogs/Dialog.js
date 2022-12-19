import React from 'react';
import {Pressable, Text, View} from 'react-native';
import Checkbox from '../Checkbox';
import {colors} from '../../theme';
import styles from './styles';

function getLastMessageDateString(dialog) {
  if (!dialog.lastMessageDateSent) {
    return '';
  }
  const DAY = 1000 * 60 * 60 * 24;
  const now = new Date();
  const yesterday = new Date(now.getTime() - DAY);
  const startOfYesterday = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate(),
    0,
    0,
    0,
    0,
  );
  const lastMessageDate = new Date(dialog.lastMessageDateSent);
  if (dialog.lastMessageDateSent < startOfYesterday.getTime()) {
    return lastMessageDate
      .toDateString()
      .replace(/(^\w+\s)|(\s\d+$)/g, '')
      .replace(/(\w+)\s(\w+)/, '$2 $1')
      .replace(/^0?/, '');
  }
  if (lastMessageDate.getDate() === now.getDate()) {
    const hours = lastMessageDate.getHours().toString();
    let minutes = lastMessageDate.getMinutes().toString();
    if (minutes.length < 2) {
      minutes = `0${minutes}`;
    }
    return `${hours}:${minutes}`;
  } else {
    return 'Yesterday';
  }
}

function Dialog(props) {
  const {dialog, isSelected, onLongPress, onPress, selectable = false} = props;
  const pressHandler = () => onPress && onPress(dialog);
  const longPressHandler = () => onLongPress && onLongPress(dialog);

  const dialogBtnStyle = isSelected
    ? [styles.dialogBtn, styles.dialogBtnSelected]
    : styles.dialogBtn;
  const circleText = Array.from(dialog.name)[0].toUpperCase();
  return (
    <Pressable
      android_ripple={{color: colors.primary}}
      onLongPress={longPressHandler}
      onPress={pressHandler}
      style={dialogBtnStyle}>
      <View style={[styles.dialogCircle, { backgroundColor: dialog.color }]}>
        <Text style={styles.dialogCircleText}>{circleText}</Text>
      </View>
      <View style={styles.dialogNameAndLastMessageContainer}>
        <Text numberOfLines={1} style={styles.dialogName}>
          {dialog.name}
        </Text>
        {dialog.lastMessage ? (
          <Text numberOfLines={1} style={styles.dialogLastMessage}>
            {dialog.lastMessage}
          </Text>
        ) : dialog.lastMessageDateSent ? (
          <Text numberOfLines={1} style={styles.dialogLastMessage}>
            Attachment
          </Text>
        ) : null}
      </View>
      <View style={styles.dialogRightView}>
        {selectable ? (
          <View style={styles.checkboxView}>
            <Checkbox checked={isSelected} />
          </View>
        ) : (
          <React.Fragment>
            <Text style={styles.dialogLastMessageDate}>
              {getLastMessageDateString(dialog)}
            </Text>
            {dialog.unreadMessagesCount ? (
              <View style={styles.unreadMsgBadge}>
                <Text style={styles.unreadMsgText}>
                  {dialog.unreadMessagesCount > 99
                    ? '99+'
                    : dialog.unreadMessagesCount}
                </Text>
              </View>
            ) : null}
          </React.Fragment>
        )}
      </View>
    </Pressable>
  );
}

export default React.memo(Dialog);
