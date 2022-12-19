import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {createStructuredSelector} from 'reselect';

import AttachButton from '../AttachButton';
import UploadIndicator from '../UploadIndicator';
import {
  messagesSendingSelector,
  contentUploadProgressSelector,
  contentIsUploadingSelector,
} from '../../selectors';
import {
  dialogStartTyping,
  dialogStopTyping,
  fileUpload,
  fileUploadCancel,
  messageSend,
} from '../../actionCreators';
import {useActions, useDebounce} from '../../hooks';
import {showError} from '../../NotificationService';
import {colors} from '../../theme';
import {SEND} from '../../images';
import styles from './styles';

const MB = 1048576;
const MAX_FILE_SIZE = 100;
const TYPING_DEBOUNCE = 3000;

const selector = createStructuredSelector({
  isSending: messagesSendingSelector,
  uploadProgress: contentUploadProgressSelector,
  uploading: contentIsUploadingSelector,
});

const actions = {
  cancelUpload: fileUploadCancel,
  sendIsTyping: dialogStartTyping,
  sendMessage: messageSend,
  sendStoppedTyping: dialogStopTyping,
  uploadFile: fileUpload,
};

export default function MessageInput(props) {
  const {dialogId} = props;
  const {isSending, uploadProgress, uploading} = useSelector(selector);
  const {
    cancelUpload,
    sendIsTyping,
    sendMessage,
    sendStoppedTyping,
    uploadFile,
  } = useActions(actions);

  const [message, setMessage] = useState('');
  const [file, setFile] = useState(undefined);
  const [preview, setPreview] = useState('');
  const isTyping = useRef(false);
  const debouncedMessage = useDebounce(message, TYPING_DEBOUNCE);

  const allowSelectAttachment = useCallback(() => {
    const fileSelected = Boolean(file || preview);
    if (fileSelected) {
      showError('You can send 1 attachment per message');
    }
    return !fileSelected;
  }, [file, preview]);

  const onFileSelected = response => {
    if (response.didCancel) {
      return;
    }
    if (response.errorMessage) {
      return showError('Error', response.errorMessage);
    }
    if (response.assets && response.assets.length) {
      const [asset] = response.assets;
      if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE * MB) {
        return showError(
          'The uploaded file exceeds maximum file size (100MB)',
        );
      }
      setPreview(asset.uri);
      uploadFile({
        reject: action => showError('File upload failed', action.error),
        resolve: action => setFile(action.payload),
        url: asset.uri,
      });
    }
  };

  const clearFile = () => {
    cancelUpload();
    setFile(undefined);
    setPreview(undefined);
  };

  const onChangeText = text => {
    if (!isTyping.current && text) {
      sendIsTyping(dialogId);
      isTyping.current = true;
    }
    setMessage(text);
  };

  const onStoppedTyping = React.useCallback(() => {
    if (isTyping.current) {
      sendStoppedTyping(dialogId);
      isTyping.current = false;
    }
  }, [dialogId, sendStoppedTyping]);

  useEffect(() => {
    onStoppedTyping();
  }, []);
  useEffect(() => {
    onStoppedTyping();
  }, [debouncedMessage, onStoppedTyping]);

  const onSendMessage = useCallback(() => {
    if (isTyping.current) {
      sendStoppedTyping(dialogId);
      isTyping.current = false;
    }
    const payload = {
      attachments: [],
      body: message.trim(),
      dialogId,
      markable: true,
    };
    if (file) {
      const {uid: id, contentType} = file;
      let type = 'file';
      if (contentType.indexOf('image') > -1) {
        type = 'image';
      }
      if (contentType.indexOf('video') > -1) {
        type = 'video';
      }
      payload.attachments.push({contentType, id, type});
      payload.body = 'Attachment';
    }
    sendMessage({
      reject: action => showError('Failed to send message', action.error),
      resolve: () => {
        setFile(undefined);
        setMessage('');
        setPreview(undefined);
      },
      ...payload,
    });
  }, [dialogId, file, message, sendMessage, sendStoppedTyping]);

  return (
    <React.Fragment>
      {preview ? (
        <View style={styles.messageInputAttachmentPreviewContainer}>
          <View style={styles.messageInputAttachmentPreviewItem}>
            <Image
              source={{uri: preview}}
              style={styles.messageInputAttachmentPreviewImage}
            />
            {uploading ? (
              <View style={styles.messageInputBackdrop}>
                <UploadIndicator
                  borderWidth={3}
                  color={colors.white}
                  percent={uploadProgress}
                  radius={22}
                />
              </View>
            ) : (
              <Pressable
                onPress={clearFile}
                style={styles.messageInputBackdropTopRight}>
                <Text style={styles.messageInputClearAttachment}>&times;</Text>
              </Pressable>
            )}
          </View>
        </View>
      ) : null}
      <View style={styles.messageInputFieldView}>
        <AttachButton
          disabled={isSending}
          onAttachment={onFileSelected}
          onPress={allowSelectAttachment}
        />
        <TextInput
          maxLength={1000}
          multiline={true}
          onChangeText={onChangeText}
          placeholder="Send message..."
          placeholderTextColor={colors.gray}
          style={styles.messageInputField}
          value={message}
        />
        <Pressable
          disabled={isSending || uploading || (!message.trim() && !file)}
          onPress={onSendMessage}
          style={styles.messageInputSendButton}>
          {isSending || uploading ? (
            <ActivityIndicator color={colors.primary} size={28} />
          ) : (
            <Image source={SEND} style={styles.messageInputSendButtonIcon} />
          )}
        </Pressable>
      </View>
    </React.Fragment>
  );
}
