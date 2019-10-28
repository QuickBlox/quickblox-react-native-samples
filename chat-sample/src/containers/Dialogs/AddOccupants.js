import { connect } from 'react-redux'

import AddOccupants from '../../components/Dialogs/AddOccupants'
import { dialogCreateCancel } from '../../actionCreators'
import { sendMessage, updateDialog } from '../../thunks'

const mapStateToProps = ({ auth, users }) => ({
  currentUser: auth.user,
  selected: users.selected,
  users: users.users,
})

const mapDispatchToProps = {
  cancel: dialogCreateCancel,
  sendMessage,
  updateDialog,
}

export default connect(mapStateToProps, mapDispatchToProps)(AddOccupants)