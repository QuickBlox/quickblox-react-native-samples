import {
  MESSAGES_GET_FAIL,
  MESSAGES_GET_REQUEST,
  MESSAGES_GET_SUCCESS,
  MESSAGES_MARK_DELIVERED_FAIL,
  MESSAGES_MARK_DELIVERED_REQUEST,
  MESSAGES_MARK_DELIVERED_SUCCESS,
  MESSAGES_MARK_READ_FAIL,
  MESSAGES_MARK_READ_REQUEST,
  MESSAGES_MARK_READ_SUCCESS,
  MESSAGES_SEND_FAIL,
  MESSAGES_SEND_REQUEST,
  MESSAGES_SEND_SUCCESS,
  MESSAGES_SYSTEM_SEND_FAIL,
  MESSAGES_SYSTEM_SEND_REQUEST,
  MESSAGES_SYSTEM_SEND_SUCCESS,
} from '../constants'

export function messagesGet(query) {
  return { type: MESSAGES_GET_REQUEST, payload: query }
}

export function messagesGetSuccess(response) {
  return { type: MESSAGES_GET_SUCCESS, payload: response }
}

export function messagesGetFail(error) {
  return { type: MESSAGES_GET_FAIL, error }
}

export function messageMarkDelivered(message) {
  return {
    type: MESSAGES_MARK_DELIVERED_REQUEST,
    payload: { message }
  }
}

export function messageMarkDeliveredSuccess() {
  return { type: MESSAGES_MARK_DELIVERED_SUCCESS }
}

export function messageMarkDeliveredFail(error) {
  return { type: MESSAGES_MARK_DELIVERED_FAIL, error }
}

export function messageMarkRead(message) {
  return {
    type: MESSAGES_MARK_READ_REQUEST,
    payload: { message }
  }
}

export function messageMarkReadSuccess() {
  return { type: MESSAGES_MARK_READ_SUCCESS }
}

export function messageMarkReadFail(error) {
  return { type: MESSAGES_MARK_READ_FAIL, error }
}

export function messageSend(message) {
  return { type: MESSAGES_SEND_REQUEST, payload: message }
}

export function messageSendSuccess() {
  return { type: MESSAGES_SEND_SUCCESS }
}

export function messageSendFail(error) {
  return { type: MESSAGES_SEND_FAIL, error }
}

export function messageSystemSend(message) {
  return { type: MESSAGES_SYSTEM_SEND_REQUEST, payload: message }
}

export function messageSystemSendSuccess() {
  return { type: MESSAGES_SYSTEM_SEND_SUCCESS }
}

export function messageSystemSendFail(error) {
  return { type: MESSAGES_SYSTEM_SEND_FAIL, error }
}