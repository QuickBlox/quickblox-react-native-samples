import { connect } from 'react-redux'

import ViewedBy from '../../components/Messages/ViewedBy'
import { getUsers } from '../../thunks'

const mapStateToProps = ({ users }, { navigation }) => {
  const message = navigation.getParam('message')
  const { readIds = [] } = message
  const data = users.users.filter(user =>
    readIds.indexOf(user.id) > -1
  )
  return {
    data,
    message,
    users: users.users,
  }
}

const mapDispatchToProps = { getUsers }

export default connect(mapStateToProps, mapDispatchToProps)(ViewedBy)