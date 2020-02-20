import { connect } from 'react-redux'

import CheckConnection from '../components/CheckConnection'

import { chatConnectAndSubscribe } from '../actionCreators'

const mapStateToProps = ({ chat, webrtc }) => ({
  connected: chat.connected,
  loading: chat.loading,
  session: webrtc.session,
})

const mapDispatchToProps = {
  connectAndSubscribe: chatConnectAndSubscribe
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckConnection)