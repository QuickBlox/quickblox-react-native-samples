import { connect } from 'react-redux'

import DialogsCreate1 from '../../components/Dialogs/Create1'
import { dialogCreateCancel } from '../../actionCreators'
import { createDialog } from '../../thunks'

const mapStateToProps = ({ auth, users }) => ({
  selected: users.selected,
})

const mapDispatchToProps = {
  cancel: dialogCreateCancel,
  createDialog,
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogsCreate1)