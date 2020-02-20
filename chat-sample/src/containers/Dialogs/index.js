import { connect } from 'react-redux'

import DialogsScreen from '../../components/Dialogs'
import {
  dialogLeave,
  dialogSelectReset,
  logoutRequest,
} from '../../actionCreators'

const mapStateToProps = ({ auth, dialogs }) => ({
  loading: dialogs.loading,
  selected: dialogs.selected,
  user: auth.user,
})

const mapDispatchToProps = {
  leaveDialog: dialogLeave,
  logout: logoutRequest,
  resetSelection: dialogSelectReset,
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogsScreen)