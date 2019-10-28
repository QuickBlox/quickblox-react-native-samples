import { connect } from 'react-redux'

import MessagesList from '../../components/Messages/List'
import { getMessages, markAsRead } from '../../thunks'

const mapMessagesToSections = (messages = []) => messages
  .sort((a, b) => +b.dateSent - +a.dateSent)
  .reduce((acc, message) => {
    const date = new Date(message.dateSent)
    const section = acc.find(({ title }) => (
      title.getDate() === date.getDate() &&
      title.getMonth() === date.getMonth() &&
      title.getFullYear() === date.getFullYear()
    ))
    if (section) {
      section.data.push(message)
    } else {
      acc.push({
        title: date, data: [message]
      })
    }
    return acc
  }, [])


const mapStateToProps = ({ auth, dialogs, messages }, { dialogId }) => {
  const dialog = dialogs.dialogs.find(d => d.id === dialogId) || {}
  const { type, unreadMessagesCount = 0 } = dialog
  const { loading, messages: data } = messages
  const messagesData = data[dialogId]
  return {
    currentUser: auth.user,
    hasMore: messagesData ? messagesData.hasMore : false,
    loading,
    dialogType: type,
    sections: mapMessagesToSections(messagesData),
    unreadMessagesCount,
  }
}

const mapDispatchToProps = { getMessages, markAsRead }

export default connect(mapStateToProps, mapDispatchToProps)(MessagesList)