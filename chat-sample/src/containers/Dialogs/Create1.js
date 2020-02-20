import { connect } from 'react-redux'

import DialogsCreate1 from '../../components/Dialogs/Create1'
import { dialogCreate, dialogCreateCancel } from '../../actionCreators'

const mapStateToProps = ({ auth, users }) => ({
  selected: users.selected,
})

const mapDispatchToProps = {
  cancel: dialogCreateCancel,
  createDialog: dialogCreate,
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogsCreate1)