import { connect } from 'react-redux'

import CheckAuth from '../components/CheckAuth'

const mapStateToProps = ({ app, auth, chat }) => ({
  appReady: app.ready,
  chatConnected: chat.connected,
  loggedIn: auth.loggedIn,
})

const mapDispatchToProps = { }

export default connect(mapStateToProps, mapDispatchToProps)(CheckAuth)