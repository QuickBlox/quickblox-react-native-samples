import { connect } from 'react-redux'

import ForwardTo from '../../components/Messages/ForwardTo'
import { dialogSelectReset } from '../../actionCreators'
import { sendMessage } from '../../thunks'

const mapStateToProps = ({ dialogs }) => ({
  dialogs: dialogs.dialogs,
  loading: dialogs.loading,
  selected: dialogs.selected,
})

const mapDispatchToProps = {
  cancel: dialogSelectReset,
  sendMessage,
}

export default connect(mapStateToProps, mapDispatchToProps)(ForwardTo)