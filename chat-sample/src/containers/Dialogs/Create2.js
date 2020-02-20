import { connect } from 'react-redux'

import DialogsCreate2 from '../../components/Dialogs/Create2'
import { dialogCreate, messageSend } from '../../actionCreators'

const mapStateToProps = ({ auth, users }) => ({
  currentUser: auth.user,
  occupantsIds: users.selected,
  users: users.users,
})

const mapDispatchToProps = {
  createDialog: dialogCreate,
  sendMessage: messageSend,
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogsCreate2)