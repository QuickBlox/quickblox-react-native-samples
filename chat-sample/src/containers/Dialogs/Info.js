import { connect } from 'react-redux'

import DialogInfo from '../../components/Dialogs/Info'
import { usersGet } from '../../actionCreators'

const mapStateToProps = ({ dialogs, users }, { navigation }) => {
  const dialogParam = navigation.getParam('dialog')
  const dialog = dialogs.dialogs.find(dialog => dialog.id === dialogParam.id)
  const data = dialog
    .occupantsIds
    .map(userId => users.users.find(user => user.id === userId))
    .filter(user => user)
  return {
    data,
    dialog,
    loading: users.loading,
    users: users.users,
  }
}

const mapDispatchToProps = { getUsers: usersGet }

export default connect(mapStateToProps, mapDispatchToProps)(DialogInfo)