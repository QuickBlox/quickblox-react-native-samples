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
  RECEIVED_NEW_MESSAGE,
} from '../constants';

export function receivedNewMessage(query) {
  return {payload: query, type: RECEIVED_NEW_MESSAGE};
}

export function messagesGet(query) {
  return {payload: query, type: MESSAGES_GET_REQUEST};
}

export function messagesGetSuccess(response) {
  return {payload: response, type: MESSAGES_GET_SUCCESS};
}

export function messagesGetFail(error) {
  return {error, type: MESSAGES_GET_FAIL};
}

export function messageMarkDelivered(message) {
  return {
    payload: {message},
    type: MESSAGES_MARK_DELIVERED_REQUEST,
  };
}

export function messageMarkDeliveredSuccess() {
  return {type: MESSAGES_MARK_DELIVERED_SUCCESS};
}

export function messageMarkDeliveredFail(error) {
  return {error, type: MESSAGES_MARK_DELIVERED_FAIL};
}

export function messageMarkRead(message) {
  return {
    payload: {message},
    type: MESSAGES_MARK_READ_REQUEST,
  };
}

export function messageMarkReadSuccess(payload) {
  return {payload, type: MESSAGES_MARK_READ_SUCCESS};
}

export function messageMarkReadFail(error) {
  return {error, type: MESSAGES_MARK_READ_FAIL};
}

export function messageSend(message) {
  return {payload: message, type: MESSAGES_SEND_REQUEST};
}

export function messageSendSuccess() {
  return {type: MESSAGES_SEND_SUCCESS};
}

export function messageSendFail(error) {
  return {error, type: MESSAGES_SEND_FAIL};
}

export function messageSystemSend(message) {
  return {payload: message, type: MESSAGES_SYSTEM_SEND_REQUEST};
}

export function messageSystemSendSuccess() {
  return {type: MESSAGES_SYSTEM_SEND_SUCCESS};
}

export function messageSystemSendFail(error) {
  return {error, type: MESSAGES_SYSTEM_SEND_FAIL};
}
