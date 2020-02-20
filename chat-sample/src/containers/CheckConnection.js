import { connect } from 'react-redux'

import CheckConnection from '../components/CheckConnection'

import { chatConnectAndSubscribe } from '../actionCreators'

const mapStateToProps = ({ chat }) => ({
  connected: chat.connected,
  loading: chat.loading,
})

const mapDispatchToProps = {
  connectAndSubscribe: chatConnectAndSubscribe
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckConnection)