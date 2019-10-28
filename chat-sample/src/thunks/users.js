import QB from 'quickblox-react-native-sdk'

import {
  usersCreate,
  usersCreateFail,
  usersCreateSuccess,
  usersGet,
  usersGetFail,
  usersGetSuccess,
  usersUpdate,
  usersUpdateFail,
  usersUpdateSuccess,
} from '../actionCreators'
import { showError } from '../NotificationService'

const backgroundColors = [
  '#53c6a2',
  '#fdd762',
  '#9261d3',
  '#43dce7',
  '#ffcc5a',
  '#ea4398',
  '#4a5de1',
  '#e95555',
  '#7eda54',
  '#f9b647',
]
const getRandomColor = () => {
  return backgroundColors[backgroundColors.length * Math.random() | 0]
}
const operationsCache = {}

const defaultQuery = {
  append: false,
  sort: {
    ascending: false,
    field: QB.users.USERS_FILTER.FIELD.LAST_REQUEST_AT,
    type: QB.users.USERS_FILTER.TYPE.DATE
  },
}

export const createUser = userData => dispatch => {
  dispatch(usersCreate(userData))
  return QB
    .users
    .create(userData)
    .then(user => dispatch(usersCreateSuccess(user)))
    .catch(e => {
      showError('Failed to create new user', e.message)
      return dispatch(usersCreateFail(e.message))
    })
}

export const getUsers = (query = defaultQuery) => (dispatch, getState) => {
  const { users: { page, perPage, users: savedUsers } } = getState()
  const filterUserId = (
    query.filter &&
    query.filter.field === QB.users.USERS_FILTER.FIELD.ID &&
    query.filter.value &&
    query.filter.value
  )
  if (filterUserId) {
    const user = savedUsers.find(user => user.id === +filterUserId)
    if (user) {
      return Promise.resolve([user])
    }
    if (operationsCache[filterUserId]) {
      return Promise.resolve([])
    } else {
      operationsCache[filterUserId] = true
    }
  }
  const filter = Object.assign({}, defaultQuery, query, { page, perPage })
  dispatch(usersGet(filter))
  return QB
    .users
    .getUsers(filter)
    .then(response => {
      const usersWithColor = response.users.map(user => {
        const savedUser = savedUsers.find(u => u.id === user.id)
        const color = savedUser && savedUser.color ?
          savedUser.color :
          getRandomColor()
        return { ...user, color }
      })
      dispatch(usersGetSuccess({
        append: filter.append,
        page: response.page,
        perPage: response.perPage,
        total: response.total,
        users: usersWithColor,
      }))
    })
    .catch(e => {
      showError('Failed to get users', e.message)
      return dispatch(usersGetFail(e.message))
    })
    .finally(() => {
      if (filterUserId) {
        operationsCache[filterUserId] = false
      }
    })
}

export const updateUser = userData => dispatch => {
  dispatch(usersUpdate(userData))
  return QB
    .users
    .update(userData)
    .then(user => dispatch(usersUpdateSuccess(user)))
    .catch(e => dispatch(usersUpdateFail(e.message)))
}