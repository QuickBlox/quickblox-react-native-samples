import { connect } from 'react-redux'

import UsersList from '../../components/Users/List'
import { usersSelect } from '../../actionCreators'
import { getUsers } from '../../thunks'

const mapStateToProps = ({ auth, users }, { exclude = [] }) => ({
  data: users
    .users
    .filter(user => user.id !== auth.user.id)
    .filter(user => exclude.indexOf(user.id) === -1),
  filter: users.filter,
  loading: users.loading,
  page: users.page,
  perPage: users.perPage,
  selected: users.selected,
  total: users.total,
})

const mapDispatchToProps = {
  getUsers,
  selectUser: usersSelect,
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersList)