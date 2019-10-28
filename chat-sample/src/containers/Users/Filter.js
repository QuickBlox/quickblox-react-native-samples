import { connect } from 'react-redux'

import UsersFilter from '../../components/Users/Filter'
import { usersSetFilter } from '../../actionCreators'
import { getUsers } from '../../thunks'

const mapStateToProps = ({ users }) => ({
  filter: users.filter
})

const mapDispatchToProps = {
  getUsers,
  setFilter: usersSetFilter,
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersFilter)