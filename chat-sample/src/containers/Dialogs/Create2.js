import { connect } from 'react-redux'

import DialogsCreate2 from '../../components/Dialogs/Create2'
import { createDialog, sendMessage } from '../../thunks'

const mapStateToProps = ({ auth, users }) => ({
  currentUser: auth.user,
  occupantsIds: users.selected,
  users: users.users,
})

const mapDispatchToProps = {
  createDialog,
  sendMessage,
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogsCreate2)