import { connect } from 'react-redux'

import CheckConnection from '../components/CheckConnection'

import { connectAndSubscribe } from '../thunks'

const mapStateToProps = ({ chat }) => ({
  connected: chat.connected,
  loading: chat.loading,
})

const mapDispatchToProps = {
  connectAndSubscribe
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckConnection)