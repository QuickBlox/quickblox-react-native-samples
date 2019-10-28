import { connect } from 'react-redux'

import Messages from '../../components/Messages'
import { leaveDialog, sendMessage } from '../../thunks'

const mapStateToProps = ({ auth }) => ({
  currentUser: auth.user || {}
})

const mapDispatchToProps = { leaveDialog, sendMessage }

export default connect(mapStateToProps, mapDispatchToProps)(Messages)