import { connect } from 'react-redux'

import TypingIndicator from '../components/TypingIndicator'

const getTyping = (dialogId, dialogs, users, currentUser) => {
  const dialog = dialogs.find(d => d.id === dialogId)
  if (dialog && dialog.typing && dialog.typing.length) {
    if (dialog.typing.length === 1 && dialog.typing[0] === currentUser.id) {
      return ''
    }
    const typingUsersIds = dialog.typing.filter(userId =>
      currentUser.id !== userId
    )
    const userNames = typingUsersIds
      .map(userId => {
        const user = users.find(user => user.id === userId)
        return user ? (user.fullName || user.login) : undefined
      })
      .filter(value => value)
    if (userNames.length === 0) {
      return 'typing...'
    } else if (userNames.length === 1) {
      return `${userNames.join()} typing...`
    } else if (userNames.length === 2) {
      return `${userNames.join(' and ')} are typing...`
    } else {
      return (
        userNames[0] +
        userNames[1] +
        ` and ${userNames.length - 2} more are typing`
      )
    }
  } else {
    return ''
  }
}

const mapStateToProps = ({ auth, dialogs, users }, { dialogId }) => ({
  typing: dialogId ? getTyping(
    dialogId,
    dialogs.dialogs,
    users.users,
    auth.user
  ) : ''
})

const mapDispatchToProps = null

export default connect(mapStateToProps, mapDispatchToProps)(TypingIndicator)