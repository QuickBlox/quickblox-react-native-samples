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
} from '../constants';

export function usersCreate(data) {
  return {payload: data, type: USERS_CREATE_REQUEST};
}

export function usersCreateSuccess(user) {
  return {payload: user, type: USERS_CREATE_SUCCESS};
}

export function usersCreateFail(error) {
  return {error, type: USERS_CREATE_FAIL};
}

export function usersGet(payload) {
  return {payload, type: USERS_GET_REQUEST};
}

export function usersGetSuccess(data) {
  return {payload: data, type: USERS_GET_SUCCESS};
}

export function usersGetFail(error) {
  return {error, type: USERS_GET_FAIL};
}

export function usersUpdate(profile) {
  return {payload: profile, type: USERS_UPDATE_REQUEST};
}

export function usersUpdateSuccess(user) {
  return {payload: user, type: USERS_UPDATE_SUCCESS};
}

export function usersUpdateFail(error) {
  return {error, type: USERS_UPDATE_FAIL};
}

export function usersSelect(userId) {
  return {payload: userId, type: USERS_SELECT};
}

export function usersBulkSelect(userIds) {
  return {payload: userIds, type: USERS_BULK_SELECT};
}

export function usersSetFilter(filter) {
  return {payload: filter, type: USERS_SET_FILTER};
}

export function usersSetPage(page) {
  return {payload: page, type: USERS_SET_PAGE};
}
