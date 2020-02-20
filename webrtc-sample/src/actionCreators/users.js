import {
  USERS_BULK_SELECT,
  USERS_CREATE_FAIL,
  USERS_CREATE_REQUEST,
  USERS_CREATE_SUCCESS,
  USERS_GET_FAIL,
  USERS_GET_REQUEST,
  USERS_GET_SUCCESS,
  USERS_SELECT,
  USERS_SET_FILTER,
  USERS_SET_PAGE,
  USERS_UPDATE_FAIL,
  USERS_UPDATE_REQUEST,
  USERS_UPDATE_SUCCESS,
} from '../constants'

export function usersCreate(data) {
  return { type: USERS_CREATE_REQUEST, payload: data }
}

export function usersCreateSuccess(user) {
  return { type: USERS_CREATE_SUCCESS, payload: user }
}

export function usersCreateFail(error) {
  return { type: USERS_CREATE_FAIL, error }
}

export function usersGet(payload) {
  return { type: USERS_GET_REQUEST, payload }
}

export function usersGetSuccess(data) {
  return { type: USERS_GET_SUCCESS, payload: data }
}

export function usersGetFail(error) {
  return { type: USERS_GET_FAIL, error }
}

export function usersUpdate(profile) {
  return { type: USERS_UPDATE_REQUEST, payload: profile }
}

export function usersUpdateSuccess(user) {
  return { type: USERS_UPDATE_SUCCESS, payload: user }
}

export function usersUpdateFail(error) {
  return { type: USERS_UPDATE_FAIL, error }
}

export function usersSelect(payload) {
  return { type: USERS_SELECT, payload }
}

export function usersBulkSelect(userIds) {
  return { type: USERS_BULK_SELECT, payload: userIds }
}

export function usersSetFilter(filter) {
  return { type: USERS_SET_FILTER, payload: filter }
}

export function usersSetPage(page) {
  return { type: USERS_SET_PAGE, payload: page }
}