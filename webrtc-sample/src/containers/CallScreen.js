import { connect } from 'react-redux'

import CallScreen from '../components/CallScreen'
import {
  usersGet,
  webrtcAccept,
  webrtcHangUp,
  webrtcReject,
  webrtcSwitchAudioOutput,
  webrtcSwitchCamera,
  webrtcToggleAudio,
  webrtcToggleVideo,
} from '../actionCreators'

const getUserFromSessionInitiator = (session, currentUser, users = []) => {
  if (!session) return
  if (session.initiatorId === currentUser.id) return currentUser
  return users.find(user => user.id === session.initiatorId)
}

const mapStateToProps = ({ auth, users, webrtc }) => ({
  caller: getUserFromSessionInitiator(webrtc.session, auth.user, users.users),
  currentUser: auth.user,
  onCall: webrtc.onCall,
  opponentsLeftCall: webrtc.opponentsLeftCall,
  peers: webrtc.peers,
  session: webrtc.session,
  users: users.users,
})

const mapDispatchToProps = {
  accept: webrtcAccept,
  getUsers: usersGet,
  hangUp: webrtcHangUp,
  reject: webrtcReject,
  switchAudio: webrtcSwitchAudioOutput,
  switchCamera: webrtcSwitchCamera,
  toggleAudio: webrtcToggleAudio,
  toggleVideo: webrtcToggleVideo,
}

export default connect(mapStateToProps, mapDispatchToProps)(CallScreen)