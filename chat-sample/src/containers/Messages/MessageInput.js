import { connect } from 'react-redux'

import MessageInput from '../../components/Messages/MessageInput'
import { sendMessage, uploadFile } from '../../thunks'

const mapStateToProps = ({ messages }, { dialogId }) => ({
  isSending: messages.sending,
  dialogId,
})

const mapDispatchToProps = { sendMessage, uploadFile }

export default connect(mapStateToProps, mapDispatchToProps)(MessageInput)