import {combineReducers} from 'redux';

import app from './app';
import auth from './auth';
import chat from './chat';
import content from './content';
import dialogs from './dialogs';
import info from './info';
import messages from './messages';
import pushNotifications from './pushNotifications';
import users from './users';

export default combineReducers({
  app,
  auth,
  chat,
  content,
  dialogs,
  info,
  messages,
  pushNotifications,
  users,
});
