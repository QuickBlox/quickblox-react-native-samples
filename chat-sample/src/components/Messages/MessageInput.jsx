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

import AttachButton from '../AttachButton'
import UploadIndicator from '../UploadIndicator'
import { showError } from '../../NotificationService'
import { colors } from '../../theme'
import { SEND } from '../../images'

const styles = StyleSheet.create({
  previewContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.inputShadow,
    borderTopWidth: 1,
    elevation: 8,
    flexDirection: 'row',
    padding: 8,
    shadowColor: colors.inputShadow,
    shadowOffset: { height: -4, width: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    width: '100%',
  },
  previewItem: {
    alignItems: 'center',
    height: 80,
    justifyContent: 'center',
    minWidth: 80,
    position: 'relative',
  },
  previewImage: {
    height: 80,
    minWidth: 80,
    resizeMode: 'contain',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  backdropTopRight: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    height: 30,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    width: 30,
  },
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
  attachClearText: {
    color: colors.white,
    fontSize: 32,
    lineHeight: 32,
    textAlign: 'center',
  },
  sendBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  sendBtnIcon: {
    height: 30,
    resizeMode: 'contain',
    width: 30,
  },
})

export default class MessageInput extends React.Component {

  state = {
    file: undefined,
    isTyping: false,
    message: '',
    preview: undefined,
  }
  typingTimeout = undefined
  TYPING_DEBOUNCE = 1000
  MAX_FILE_SIZE = 104857600 // 100 MB

  allowSelectAttachment = () => {
    const fileSelected = Boolean(this.state.file || this.state.preview)
    if (fileSelected) {
      showError('You can send 1 attachment per message')
    }
    return !fileSelected
  }

  fileSelected = response => {
    if (response.didCancel) {
      return
    }
    if (response.error) {
      return showError('Error', response.error)
    }
    if (response.uri) {
      if (response.size || response.fileSize) {
        const size = response.size || response.fileSize
        if (size > this.MAX_FILE_SIZE) {
          return showError(
            'The uploaded file exceeds maximum file size (100MB)'
          )
        }
      }
      this.setState({ preview: response.uri })
      const { uploadFile } = this.props
      new Promise((resolve, reject) => {
        uploadFile({ url: response.uri, resolve, reject })
      })
      .then(action => this.setState({
        file: action.payload,
        message: this.state.message.trim().length ?
          this.state.message :
          '[attachment]'
      }))
      .catch(action => showError('File upload failed', action.error))
    }
  }

  clearFile = () => {
    this.props.cancelUpload()
    this.setState({
      file: undefined,
      message: '',
      preview: undefined,
    })
  }

  onChangeText = text => {
    const { dialogId, sendIsTyping, sendStoppedTyping } = this.props
    if (!this.state.isTyping) {
      sendIsTyping(dialogId)
    }
    this.setState({ isTyping: true, message: text })
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout)
    }
    this.typingTimeout = setTimeout(() => {
      this.setState({ isTyping: false })
      sendStoppedTyping(dialogId)
    }, this.TYPING_DEBOUNCE)
  }

  sendMessage = () => {
    const { dialogId, sendMessage } = this.props
    const { file, message } = this.state
    const payload = {
      attachments: [],
      body: message.trim(),
      dialogId,
    }
    if (file) {
      const { uid: id, contentType } = file
      let type = 'file'
      if (contentType.indexOf('image') > -1) {
        type = 'image'
      }
      if (contentType.indexOf('video') > -1) {
        type = 'video'
      }
      payload.attachments.push({ id, type, contentType })
    }
    new Promise((resolve, reject) => {
      sendMessage({ resolve, reject, ...payload })
    })
    .then(() => this.setState({
      file: undefined,
      message: '',
      preview: undefined,
    }))
    .catch(action => showError('Failed to send message', action.error))
  }

  render() {
    const { isSending, uploading, uploadProgress } = this.props
    return (
      <React.Fragment>
        {this.state.preview ? (
          <View style={styles.previewContainer}>
            <View style={styles.previewItem}>
              <Image
                source={{ uri: this.state.preview }}
                style={styles.previewImage}
              />
              {uploading ? (
                <View style={styles.backdrop}>
                  <UploadIndicator
                    borderWidth={3}
                    color={colors.white}
                    percent={uploadProgress}
                    radius={22}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={this.clearFile}
                  style={styles.backdropTopRight}
                >
                  <Text style={styles.attachClearText}>
                    &times;
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : null}
        <View style={styles.inputView}>
          <AttachButton
            disabled={isSending}
            onAttachment={this.fileSelected}
            onPress={this.allowSelectAttachment}
          />
          <TextInput
            maxLength={1000}
            multiline={true}
            onChangeText={this.onChangeText}
            placeholder="Send message..."
            placeholderTextColor={colors.gray}
            style={styles.input}
            value={this.state.message}
          />
          <TouchableOpacity
            disabled={isSending || uploading || !this.state.message.trim()}
            onPress={this.sendMessage}
            style={styles.sendBtn}
          >
            {isSending || uploading ? (
              <ActivityIndicator color={colors.primary} size={28} />
            ) : (
              <Image source={SEND} style={styles.sendBtnIcon} />
            )}
          </TouchableOpacity>
        </View>
      </React.Fragment>
    )
  }

}
