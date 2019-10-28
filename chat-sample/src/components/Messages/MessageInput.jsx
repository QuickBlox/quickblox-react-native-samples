import React from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import ImagePicker from 'react-native-image-picker'
import QB from 'quickblox-react-native-sdk'

import { showError } from '../../NotificationService'
import { colors } from '../../theme'
import { ATTACHMENT, SEND } from '../../images'

const styles = StyleSheet.create({
  inputView: {
    backgroundColor: colors.white,
    shadowColor: colors.inputShadow,
    shadowOffset: { height: -4, width: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
    flexDirection: 'row',
    width: '100%',
  },
  input: {
    flex: 1,
    fontSize: 15,
    lineHeight: 18,
    maxHeight: 18 * 3 + 5 * 2, // lineHeight * numberOfLines + padding * 2
    padding: 5,
    textAlignVertical: 'center',
  },
  attachBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  attachBtnImage: {
    height: 28,
    resizeMode: 'center',
    width: 30,
  },
  attachClearText: {
    color: colors.primary,
    fontSize: 28,
    lineHeight: 28,
    paddingHorizontal: 6,
    textAlign: 'center',
  },
  sendBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  sendBtnIcon: {
    height: 28,
    resizeMode: 'center',
    width: 30,
  },
})

export default class MessageInput extends React.Component {

  state = {
    fileUrl: '',
    isTyping: false,
    message: '',
  }
  typingTimeout = undefined
  TYPING_DEBOUNCE = 1000

  selectFile = () => {
    ImagePicker.showImagePicker(
      { title: 'Select image or video to attach', mediaType: 'mixed' },
      (response) => {
        if (response.didCancel) {
          return
        }
        if (response.error) {
          return showError('Error', response.error)
        }
        if (response.uri) {
          this.setState({
            message: response.fileName || 'image',
            fileUrl: response.uri
          })
        }
      }
    )
  }

  clearFile = () => this.setState({ fileUrl: '', message: '' })

  sendIsTyping = () => QB
    .chat
    .sendIsTyping({ dialogId: this.props.dialogId })
    .catch(e => console.warn(e.message))

  sendStoppedTyping = () => QB
    .chat
    .sendStoppedTyping({ dialogId: this.props.dialogId })
    .catch(e => console.warn(e.message))

  onChangeText = text => {
    if (!this.state.isTyping) {
      this.sendIsTyping()
    }
    this.setState({ isTyping: true, message: text })
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout)
    }
    this.typingTimeout = setTimeout(() => {
      this.setState({ isTyping: false }, this.sendStoppedTyping)
    }, this.TYPING_DEBOUNCE)
  }

  sendMessage = () => {
    const { dialogId, sendMessage, uploadFile } = this.props
    const { fileUrl, message } = this.state
    const fileUpload = fileUrl ? uploadFile(fileUrl) : Promise.resolve()
    fileUpload.then(result => {
      if (result && result.error) {
        return showError('Failed to upload file', result.error)
      }
      const file = result ? result.payload : undefined
      const payload = {
        dialogId,
        body: '',
      }
      if (file) {
        const { uid: id, contentType: type } = file
        payload.attachments = [{ id, type }]
        payload.body = '[attachment]'
      } else {
        if (message.trim().length) {
          payload.body = message
        }
      }
      sendMessage(payload)
    })
    this.setState({ message: '', fileUrl: '' })
  }

  render() {
    return (
      <View style={styles.inputView}>
        {this.state.fileUrl ? (
          <TouchableOpacity
            disabled={this.props.isSending}
            onPress={this.clearFile}
            style={styles.attachBtn}
          >
            <Text style={styles.attachClearText}>&times;</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled={this.props.isSending}
            onPress={this.selectFile}
            style={styles.attachBtn}
          >
            <Image source={ATTACHMENT} style={styles.attachBtnImage} />
          </TouchableOpacity>
        )}
        <TextInput
          editable={!this.props.isSending && !this.state.fileUrl}
          multiline={true}
          onChangeText={this.onChangeText}
          placeholder="Send message..."
          placeholderTextColor={colors.gray}
          style={styles.input}
          value={this.state.message}
        />
        <TouchableOpacity
          disabled={this.props.isSending || !this.state.message}
          onPress={this.sendMessage}
          style={styles.sendBtn}
        >
          {this.props.isSending ? (
            <ActivityIndicator color={colors.primary} size={28} />
          ) : (
            <Image source={SEND} style={styles.sendBtnIcon} />
          )}
        </TouchableOpacity>
      </View>
    )
  }

}
