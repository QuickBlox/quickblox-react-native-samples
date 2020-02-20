import { connect } from 'react-redux'

import SelectedUsersAndCallButtons from '../../components/Users/SelectedUsersAndCallButtons'
import { webrtcCall } from '../../actionCreators' // webrtc call audio & video

const mapStateToProps = ({ chat, users }) => ({
  connected: chat.connected,
  loading: chat.loading,
  users: users.selected,
})

const mapDispatchToProps = { call: webrtcCall }

export default connect(mapStateToProps, mapDispatchToProps)(SelectedUsersAndCallButtons)
