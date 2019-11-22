import { connect } from 'react-redux'

import Message from '../../../components/Messages/Message'
import { getPrivateUrl } from '../../../thunks'

const getAttachmentUrl = (imagesMap, message) => {
  const { attachments } = message
  if (Array.isArray(attachments) && attachments.length) {
    const [attachment] = attachments
    return imagesMap[attachment.id]
  }
  return undefined
}

const mapStateToProps = ({ auth, images }, { message = {} }) => {
  return {
    currentUser: auth.user,
    imageUrl: getAttachmentUrl(images, message),
  }
}

const mapDispatchToProps = { getPrivateUrl }

export default connect(mapStateToProps, mapDispatchToProps)(Message)