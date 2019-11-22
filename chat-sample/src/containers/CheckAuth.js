import { connect } from 'react-redux'

import CheckAuth from '../components/CheckAuth'

const mapStateToProps = ({ app, auth }) => ({
  appReady: app.ready,
  loggedIn: auth.loggedIn,
})

const mapDispatchToProps = null

export default connect(mapStateToProps, mapDispatchToProps)(CheckAuth)