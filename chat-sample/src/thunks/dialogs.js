import QB from 'quickblox-react-native-sdk'

import {
  dialogCreate,
  dialogCreateFail,
  dialogCreateSuccess,
  dialogDelete,
  dialogDeleteFail,
  dialogDeleteSuccess,
  dialogEdit,
  dialogEditFail,
  dialogEditSuccess,
  dialogGet,
  dialogGetFail,
  dialogGetSuccess,
  dialogJoin,
  dialogJoinFail,
  dialogJoinSuccess,
  dialogLeave,
  dialogLeaveFail,
  dialogLeaveSuccess,
} from '../actionCreators'
import { sendSystemMessage } from './messages'
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
const subscribedToDialogs = []

export const getDialogs = (params = { append: false, limit: 30 }) => (dispatch, getState) => {
  const { dialogs: { dialogs: savedDialogs } } = getState()
  dispatch(dialogGet(params))
  return QB
    .chat
    .getDialogs(params)
    .then(response => {
      response.dialogs.forEach(dialog => {
        if (!dialog.isJoined) {
          dispatch(joinDialog(dialog.id))
        }
        if (subscribedToDialogs.indexOf(dialog.id) === -1) {
          QB.chat.subscribeMessageEvents({ dialogId: dialog.id })
          QB.chat.subscribeMessageStatus({ dialogId: dialog.id })
          QB.chat.subscribeTyping({ dialogId: dialog.id })
          subscribedToDialogs.push(dialog.id)
        }
        const savedDialog = savedDialogs.find(d => d.id === dialog.id)
        if (savedDialog && savedDialog.color) {
          dialog.color = savedDialog.color
        } else {
          dialog.color = getRandomColor()
        }
      })
      return dispatch(dialogGetSuccess({
        ...response,
        append: params.append
      }))
    })
    .catch(e => {
      showError('Failed to get dialogs', e.message)
      return dispatch(dialogGetFail(e.message))
    })
}

export const createDialog = params => dispatch => {
  dispatch(dialogCreate(params))
  return QB
    .chat
    .createDialog(params)
    .then(dialog => {
      dialog.color = getRandomColor()
      dispatch(dialogCreateSuccess(dialog))
      if (subscribedToDialogs.indexOf(dialog.id) === -1) {
        dispatch(notifySystemMessage(dialog.id, '1'))
        QB.chat.subscribeMessageEvents({ dialogId: dialog.id })
        QB.chat.subscribeMessageStatus({ dialogId: dialog.id })
        QB.chat.subscribeTyping({ dialogId: dialog.id })
        subscribedToDialogs.push(dialog.id)
      }
      return { dialog }
    })
    .catch(e => {
      showError('Failed to create dialog', e.message)
      return dispatch(dialogCreateFail(e.message))
    })
}

export const updateDialog = params => dispatch => {
  if (params.removeUsers && params.removeUsers.length) {
    dispatch(notifySystemMessage(params.dialogId, '3'))
  }
  dispatch(dialogEdit(params))
  return QB
    .chat
    .updateDialog(params)
    .then(dialog => {
      if (params.addUsers && params.addUsers.length) {
        dispatch(notifySystemMessage(dialog.id, '2'))
      }
      return dispatch(dialogEditSuccess(dialog))
    })
    .catch(e => {
      showError('Failed to update dialog', e.message)
      return dispatch(dialogEditFail(e.message))
    })
}

export const joinDialog = dialogId => dispatch => {
  dispatch(dialogJoin(dialogId))
  return QB
    .chat
    .joinDialog({ dialogId })
    .then(success => dispatch(dialogJoinSuccess(success)))
    .catch(e => dispatch(dialogJoinFail(e.message)))
}

export const leaveDialog = dialogId => dispatch => {
  dispatch(notifySystemMessage(dialogId, '3'))
  dispatch(dialogLeave(dialogId))
  QB.chat.unsubscribeMessageEvents({ dialogId })
  QB.chat.unsubscribeMessageStatus({ dialogId })
  QB.chat.unsubscribeTyping({ dialogId })
  if (subscribedToDialogs.indexOf(dialogId) > -1) {
    subscribedToDialogs.splice(subscribedToDialogs.indexOf(dialogId), 1)
  }
  return QB
    .chat
    .leaveDialog({ dialogId })
    .then(() => {
      dispatch(dialogLeaveSuccess(dialogId))
      dispatch(getDialogs())
    })
    .catch(e => {
      showError('Failed to leave dialog', e.message)
      return dispatch(dialogLeaveFail(e.message))
    })
}

export const deleteDialog = dialogId => dispatch => {
  dispatch(notifySystemMessage(dialogId, '3'))
  dispatch(dialogDelete(dialogId))
  QB.chat.unsubscribeMessageEvents({ dialogId })
  QB.chat.unsubscribeMessageStatus({ dialogId })
  QB.chat.unsubscribeTyping({ dialogId })
  if (subscribedToDialogs.indexOf(dialogId) > -1) {
    subscribedToDialogs.splice(subscribedToDialogs.indexOf(dialogId), 1)
  }
  return QB
    .chat
    .deleteDialog({ dialogId })
    .then(() => {
      dispatch(dialogDeleteSuccess(dialogId))
    })
    .catch(e => {
      dispatch(dialogDeleteFail(e.message))
      showError('Failed to delete dialog', e.message)
    })
}

export const notifySystemMessage = (dialogId, notification_type) => (dispatch, getState) => {
  const { auth, dialogs } = getState()
  const dialog = dialogs.dialogs.find(dialog => dialog.id === dialogId)
  if (dialog && dialog.type !== QB.chat.DIALOG_TYPE.PUBLIC_CHAT) {
    const { occupantsIds = [] } = dialog
    occupantsIds
      .filter(userId => userId !== auth.user.id)
      .forEach(userId => dispatch(sendSystemMessage({
        recipientId: userId,
        properties: {
          xmpp_room_jid: dialog.roomJid,
          name: dialog.name,
          _id: dialog.id,
          type: `${dialog.type}`,
          occupants_ids: dialog.occupantsIds.join(),
          notification_type
        }
      })))
  }
}

export const clearDialogSubscriptions = () => {
  while (subscribedToDialogs.length) {
    const dialogId = subscribedToDialogs.pop()
    QB.chat.unsubscribeMessageEvents({ dialogId })
    QB.chat.unsubscribeMessageStatus({ dialogId })
    QB.chat.unsubscribeTyping({ dialogId })
  }
}