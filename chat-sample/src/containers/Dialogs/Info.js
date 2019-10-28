import { connect } from 'react-redux'

import DialogInfo from '../../components/Dialogs/Info'
import { getUsers } from '../../thunks'

const mapStateToProps = ({ dialogs, users: { users } }, { navigation }) => {
  const dialogParam = navigation.getParam('dialog')
  const dialog = dialogs.dialogs.find(dialog => dialog.id === dialogParam.id)
  const data = dialog
    .occupantsIds
    .map(userId => users.find(user => user.id === userId))
    .filter(user => user)
  return {
    data,
    dialog,
    users,
  }
}

const mapDispatchToProps = { getUsers }

export default connect(mapStateToProps, mapDispatchToProps)(DialogInfo)