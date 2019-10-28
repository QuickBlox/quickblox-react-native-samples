import { connect } from 'react-redux'

import Login from '../../components/Auth/Login'
import {
  connectAndSubscribe,
  createUser,
  login,
  updateUser,
} from '../../thunks'

const mapStateToProps = ({ auth, chat, users }) => ({
  loading: auth.loading || chat.loading || users.loading,
})

const mapDispatchToProps = {
  connectAndSubscribe,
  createUser,
  signIn: login,
  updateUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)