import { connect } from 'react-redux'

import UsersList from '../../components/Users/List'
import { usersGet, usersSelect } from '../../actionCreators'

const mapStateToProps = ({ auth, users }, { exclude = [] }) => ({
  data: users
    .users
    .filter(user => auth.user ? user.id !== auth.user.id : true)
    .filter(user => exclude.indexOf(user.id) === -1),
  filter: users.filter,
  loading: users.loading,
  page: users.page,
  perPage: users.perPage,
  selected: users.selected,
  total: users.total,
})

const mapDispatchToProps = {
  getUsers: usersGet,
  selectUser: usersSelect,
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersList)