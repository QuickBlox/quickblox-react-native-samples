import { combineReducers } from 'redux'

import app from './app'
import auth from './auth'
import chat from './chat'
import dialogs from './dialogs'
import images from './images'
import info from './info'
import messages from './messages'
import users from './users'

export default combineReducers({
  app,
  auth,
  chat,
  dialogs,
  images,
  info,
  messages,
  users,
})