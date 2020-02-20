import { connect } from 'react-redux'

import AddOccupants from '../../components/Dialogs/AddOccupants'
import {
  dialogCreateCancel,
  dialogEdit,
  messageSend,
} from '../../actionCreators'

const mapStateToProps = ({ auth, dialogs, users }, { navigation }) => {
  const dialogParam = navigation.getParam('dialog')
  const dialog = dialogs.dialogs.find(dialog => dialog.id === dialogParam.id)
  return {
    currentUser: auth.user,
    dialog,
    selected: users.selected,
    users: users.users,
  }
}

const mapDispatchToProps = {
  cancel: dialogCreateCancel,
  sendMessage: messageSend,
  updateDialog: dialogEdit,
}

export default connect(mapStateToProps, mapDispatchToProps)(AddOccupants)