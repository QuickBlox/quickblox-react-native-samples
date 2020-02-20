import { connect } from 'react-redux'

import MessageMeta from '../../../components/Messages/Message/MessageMeta'
import { usersGet } from '../../../actionCreators'

const mapStateToProps = ({ auth, users }, { message = {} }) => {
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
    delivered,
    read,
    sender,
  }
}

const mapDispatchToProps = { getUsers: usersGet }

export default connect(mapStateToProps, mapDispatchToProps)(MessageMeta)