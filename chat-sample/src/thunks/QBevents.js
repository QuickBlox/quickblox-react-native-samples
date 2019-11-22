import QB from 'quickblox-react-native-sdk'
import { NativeEventEmitter } from 'react-native'

import {
  dialogEditSuccess,
  dialogUnreadCountIncrement,
} from '../actionCreators'
import { getDialogs, clearDialogSubscriptions } from './dialogs'
import { getMessages, markAsDelivered } from './messages'
import Navigation from '../NavigationService'

let dispatch
let _getState
const subscriptions = []


function connectionEventHandler(event) {
  const { type, payload } = event
  dispatch({ type, payload })
}

function receivedNewMessage(event) {
  const { type, payload } = event
  dispatch({ type, payload })
  const { auth, dialogs: { dialogs } } = _getState()
  const dialog = dialogs.find(d => d.id === payload.dialogId)
  if (dialog) {
    dispatch(dialogEditSuccess({
      ...dialog,
      lastMessage: payload.body,
      lastMessageDateSent: payload.dateSent,
      lastMessageUserId: payload.senderId
    }))
    if (auth.user && payload.senderId !== auth.user.id) {
      if (!payload.markable) {
        dispatch(markAsDelivered(payload))
      }
      if (dialog.type !== QB.chat.DIALOG_TYPE.PUBLIC_CHAT) {
        dispatch(dialogUnreadCountIncrement({
          dialogId: payload.dialogId
        }))
      }
    }
  } else {
    // re-load dialogs to get new dialog(s) or update occupants list
    dispatch(getDialogs())
  }
}

function messageStatusHandler(event) {
  const { type, payload } = event
  dispatch({ type, payload })
}

function systemMessageHandler(event) {
  const { type, payload } = event
  dispatch({ type, payload })
  const { _id, notification_type, type: dialogType } = payload.properties
  // dialog might be deleted by owner
  if (dialogType === '3' && notification_type === '3') {
    const route = Navigation.getCurrentRoute() || {}
    const { routeName, params = { dialog: {} } } = route
    if (routeName === 'Messages' && params.dialog.id === _id) {
      Navigation.navigate({ routeName: 'Dialogs' })
    }
  }
  // re-load dialogs to get new dialog(s) or update occupants list
  dispatch(getDialogs())
}

function userTypingHandler(event) {
  const { type, payload } = event
  dispatch({ type, payload })
}

export function subscribe(dispatcher, getState) {
  dispatch = dispatcher
  _getState = getState
  if (subscriptions.length === Object.keys(QB.chat.EVENT_TYPE).length) {
    return
  }
  const emitter = new NativeEventEmitter(QB.chat)
  const QBConnectionEvents = [
    QB.chat.EVENT_TYPE.CONNECTED,
    QB.chat.EVENT_TYPE.CONNECTION_CLOSED,
    QB.chat.EVENT_TYPE.CONNECTION_CLOSED_ON_ERROR,
    QB.chat.EVENT_TYPE.RECONNECTION_FAILED,
    QB.chat.EVENT_TYPE.RECONNECTION_SUCCESSFUL,
  ]
  QBConnectionEvents.forEach(eventName => {
    subscriptions.push(emitter.addListener(
      eventName,
      connectionEventHandler
    ))
  })
  subscriptions.push(emitter.addListener(
    QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE,
    receivedNewMessage
  ))
  subscriptions.push(emitter.addListener(
    QB.chat.EVENT_TYPE.MESSAGE_DELIVERED,
    messageStatusHandler
  ))
  subscriptions.push(emitter.addListener(
    QB.chat.EVENT_TYPE.MESSAGE_READ,
    messageStatusHandler
  ))
  subscriptions.push(emitter.addListener(
    QB.chat.EVENT_TYPE.RECEIVED_SYSTEM_MESSAGE,
    systemMessageHandler
  ))
  subscriptions.push(emitter.addListener(
    QB.chat.EVENT_TYPE.USER_IS_TYPING,
    userTypingHandler
  ))
  subscriptions.push(emitter.addListener(
    QB.chat.EVENT_TYPE.USER_STOPPED_TYPING,
    userTypingHandler
  ))
  dispatch(getDialogs())
  const route = Navigation.getCurrentRoute()
  const { routeName, params = { dialog: {} } } = route
  if (routeName === 'Messages' && params.dialog.id) {
    dispatch(getMessages({ dialogId: params.dialog.id }))
  }
}

export function unsubscribe() {
  clearDialogSubscriptions()
  while (subscriptions.length) {
    const subscription = subscriptions.pop()
    subscription.remove()
  }
  dispatch = undefined
  currentUser = undefined
}