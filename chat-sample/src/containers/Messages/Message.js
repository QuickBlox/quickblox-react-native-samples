import { connect } from 'react-redux'

import Message from '../../components/Messages/Message'
import { getPrivateUrl, getUsers } from '../../thunks'

const getAttachmentUrl = (imagesMap, message) => {
  const { attachments } = message
  if (Array.isArray(attachments) && attachments.length) {
    const [attachment] = attachments
    return imagesMap[attachment.id]
  }
  return undefined
}

const mapStateToProps = ({ auth, images, users }, { message = {} }) => {
  const sender = users.users.find(user => user.id === message.senderId)
  const currentUser = auth.user || {}
  let delivered = false
  let read = false
  if (message.senderId === currentUser.id) {
    const { deliveredIds = [], readIds = [], recipientId } = message
    if (recipientId && recipientId !== currentUser.id) {
      delivered = deliveredIds.indexOf(recipientId) > -1
      read = readIds.indexOf(recipientId) > -1
    } else {
      delivered = deliveredIds
        .filter(id => id !== currentUser.id)
        .length > 0
      read = readIds
        .filter(id => id !== currentUser.id)
        .length > 0
    }
  }
  return {
    currentUser,
    delivered,
    imageUrl: getAttachmentUrl(images, message),
    message,
    read,
    sender,
  }
}

const mapDispatchToProps = { getPrivateUrl, getUsers }

export default connect(mapStateToProps, mapDispatchToProps)(Message)