import { connect } from 'react-redux'

import Message from '../../../components/Messages/Message'
import { privateUrlGet } from '../../../actionCreators'

const getAttachmentUrl = (filesMap, message) => {
  const { attachments } = message
  if (Array.isArray(attachments) && attachments.length) {
    const [attachment] = attachments
    return filesMap[attachment.id]
  }
  return undefined
}

const mapStateToProps = ({ auth, content }, { message = {} }) => {
  return {
    currentUser: auth.user,
    imageUrl: getAttachmentUrl(content, message),
  }
}

const mapDispatchToProps = { getPrivateUrl: privateUrlGet }

export default connect(mapStateToProps, mapDispatchToProps)(Message)