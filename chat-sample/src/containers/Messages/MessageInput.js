import { connect } from 'react-redux'

import MessageInput from '../../components/Messages/MessageInput'
import {
  dialogStartTyping,
  dialogStopTyping,
  fileUpload,
  fileUploadCancel,
  messageSend,
} from '../../actionCreators'

const mapStateToProps = ({ content, messages }, { dialogId }) => ({
  dialogId,
  isSending: messages.sending,
  uploading: content.uploading,
  uploadProgress: content.uploadProgress,
})

const mapDispatchToProps = {
  cancelUpload: fileUploadCancel,
  sendIsTyping: dialogStartTyping,
  sendMessage: messageSend,
  sendStoppedTyping: dialogStopTyping,
  uploadFile: fileUpload,
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageInput)