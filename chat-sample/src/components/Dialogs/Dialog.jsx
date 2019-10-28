import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

import TypingIndicator from '../../containers/TypingIndicator'
import Checkbox from '../Checkbox'
import styles from './styles'

export default class Dialog extends React.PureComponent {

  onPress = () => {
    if (this.props.onPress) {
      this.props.onPress(this.props.dialog)
    }
  }

  onLongPress = () => {
    if (this.props.onLongPress) {
      this.props.onLongPress(this.props.dialog)
    }
  }

  getLastMessageDateString = () => {
    const { dialog } = this.props
    if (!dialog.lastMessageDateSent) {
      return ''
    }
    const now = new Date()
    const lastMessageDate = new Date(dialog.lastMessageDateSent)
    if (lastMessageDate.getFullYear() === now.getFullYear() &&
        lastMessageDate.getMonth() === now.getMonth()) {
      if (lastMessageDate.getDate() === now.getDate()) {
        const hours = lastMessageDate.getHours().toString()
        let minutes = lastMessageDate.getMinutes().toString()
        if (minutes.length < 2) {
          minutes = `0${minutes}`
        }
        return `${hours}:${minutes}`
      }
      if (lastMessageDate.getDate() === now.getDate() - 1) {
        return 'Yesterday'
      }
    }
    return lastMessageDate.toDateString().replace(/(^\w+\s)|(\s\d+$)/g, '')
  }

  render() {
    const { dialog, isSelected, selectable = false } = this.props
    const dialogBtnStyle = isSelected ?
      [styles.dialogBtn, styles.dialogBtnSelected] :
      styles.dialogBtn
    const circleText = dialog.name
      .split(',')
      .filter((str, i) => i < 2 ? str : undefined)
      .reduce((res, val) => res + val.trim().charAt(0).toUpperCase(), '')
    return (
      <TouchableOpacity
        onLongPress={this.onLongPress}
        onPress={this.onPress}
        style={dialogBtnStyle}
      >
        {dialog.photo ? (
          <Image
            resizeMode="center"
            source={{ uri: dialog.photo }}
            style={styles.dialogCircle}
            borderRadius={80}
          />
        ) : (
          <View style={[styles.dialogCircle, { backgroundColor: dialog.color }]}>
            <Text style={styles.dialogCircleText}>{circleText}</Text>
          </View>
        )}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text numberOfLines={1} style={styles.dialogName}>
            {dialog.name}
          </Text>
          {dialog.typing && dialog.typing.length ? (
            <TypingIndicator dialogId={dialog.id} />
          ) : dialog.lastMessage ? (
            <Text numberOfLines={1} style={styles.dialogLastMessage}>
              {dialog.lastMessage}
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
                {this.getLastMessageDateString()}
              </Text>
              {dialog.unreadMessagesCount ? (
                <View style={styles.unreadMsgBadge}>
                  <Text style={styles.unreadMsgText}>
                    {dialog.unreadMessagesCount > 100 ?
                      '99+' :
                      dialog.unreadMessagesCount
                    }
                  </Text>
                </View>
              ) : null}
            </React.Fragment>
          )}
        </View>
      </TouchableOpacity>
    )
  }

}