import { connect } from 'react-redux'

import Login from '../../components/Auth/Login'
import {
  chatConnectAndSubscribe,
  loginRequest,
  usersCreate,
  usersUpdate,
} from '../../actionCreators'

const mapStateToProps = ({ auth, chat, users }) => ({
  loading: auth.loading || chat.loading || users.loading,
})

const mapDispatchToProps = {
  connectAndSubscribe: chatConnectAndSubscribe,
  createUser: usersCreate,
  signIn: loginRequest,
  updateUser: usersUpdate,
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)