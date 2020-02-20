import { combineReducers } from 'redux'

import app from './app'
import auth from './auth'
import chat from './chat'
import device from './device'
import dialogs from './dialogs'
import content from './content'
import info from './info'
import messages from './messages'
import users from './users'

export default combineReducers({
  app,
  auth,
  chat,
  device,
  dialogs,
  content,
  info,
  messages,
  users,
})