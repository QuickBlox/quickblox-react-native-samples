import { eventChannel } from 'redux-saga'
import {
  call,
  cancelled,
  put,
  select,
  spawn,
  take,
} from 'redux-saga/effects'
import QB from 'quickblox-react-native-sdk'
import { NativeEventEmitter } from 'react-native'

import {
  dialogEditSuccess,
  dialogUnreadCountIncrement,
  messageMarkDelivered,
  dialogGet,
} from '../actionCreators'

function* handlewNewMessage(message) {
  const { currentUser, dialogs } = yield select(({ auth, dialogs }) => ({
    currentUser: auth.user,
    dialogs: dialogs.dialogs,
  }))
  const dialog = dialogs.find(d => d.id === message.dialogId)
  if (dialog) {
    yield put(dialogEditSuccess({
      ...dialog,
      lastMessage: message.body,
      lastMessageDateSent: message.dateSent,
      lastMessageUserId: message.senderId
    }))
    if (currentUser && message.senderId !== currentUser.id) {
      if (!message.markable) {
        yield put(messageMarkDelivered(message))
      }
      if (dialog.type !== QB.chat.DIALOG_TYPE.PUBLIC_CHAT) {
        yield put(dialogUnreadCountIncrement({
          dialogId: message.dialogId
        }))
      }
    }
  } else {
    // re-load dialogs to get new dialog(s) or update occupants list
    yield put(dialogGet())
  }
}

function* createChatEventsChannel() {
  return eventChannel(emitter => {
    const chatEmitter = new NativeEventEmitter(QB.chat)
    const subscriptions = Object.keys(QB.chat.EVENT_TYPE).map(key =>
      chatEmitter.addListener(QB.chat.EVENT_TYPE[key], emitter)
    )
    return () => {
      while (subscriptions.length) {
        const subscription = subscriptions.pop()
        subscription.remove()
      }
    }
  })
}

function* QBChatEventsSaga() {
  const channel = yield call(createChatEventsChannel)
  try {
    while (true) {
      const event = yield take(channel)
      yield put(event)
      const { type, payload } = event
      if (type === QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE) {
        yield call(handlewNewMessage, payload)
      } else if (type === QB.chat.EVENT_TYPE.RECEIVED_SYSTEM_MESSAGE) {
        yield put(dialogGet())
      }
    }
  } catch (e) {
    yield put({ type: 'ERROR', error: e.message })
  } finally {
    if (yield cancelled()) {
      channel.close()
    }
  }
}

export default [
  spawn(QBChatEventsSaga),
]
