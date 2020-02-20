import { connect } from 'react-redux'

import ForwardTo from '../../components/Messages/ForwardTo'
import { dialogSelectReset, messageSend } from '../../actionCreators'

const mapStateToProps = ({ dialogs }) => ({
  dialogs: dialogs.dialogs,
  loading: dialogs.loading,
  selected: dialogs.selected,
})

const mapDispatchToProps = {
  cancel: dialogSelectReset,
  sendMessage: messageSend,
}

export default connect(mapStateToProps, mapDispatchToProps)(ForwardTo)