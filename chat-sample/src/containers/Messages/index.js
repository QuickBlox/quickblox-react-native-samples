import { connect } from 'react-redux'

import Messages from '../../components/Messages'
import { dialogLeave } from '../../actionCreators'

const mapStateToProps = ({ dialogs: { dialogs = [] } }, { navigation }) => {
  const navParamDialog = navigation.getParam('dialog')
  const dialog = navParamDialog ?
    dialogs.find(d => d.id === navParamDialog.id) :
    undefined
  return { dialog }
}

const mapDispatchToProps = { leaveDialog: dialogLeave }

export default connect(mapStateToProps, mapDispatchToProps)(Messages)