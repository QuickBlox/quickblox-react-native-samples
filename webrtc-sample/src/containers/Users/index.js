import { connect } from 'react-redux'

import Users from '../../components/Users'
import { logoutRequest } from '../../actionCreators'

const mapStateToProps = ({ auth }) => ({
  user: auth.user,
})

const mapDispatchToProps = {
  logout: logoutRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)
