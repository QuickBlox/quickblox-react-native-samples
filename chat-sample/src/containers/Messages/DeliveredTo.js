import { connect } from 'react-redux'

import DeliveredTo from '../../components/Messages/DeliveredTo'
import { getUsers } from '../../thunks'

const mapStateToProps = ({ users }, { navigation }) => {
  const message = navigation.getParam('message')
  const { deliveredIds = [] } = message
  const data = users.users.filter(user =>
    deliveredIds.indexOf(user.id) > -1
  )
  return {
    data,
    message,
    users: users.users,
  }
}

const mapDispatchToProps = { getUsers }

export default connect(mapStateToProps, mapDispatchToProps)(DeliveredTo)