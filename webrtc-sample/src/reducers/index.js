import {combineReducers} from 'redux';

import app from './app';
import auth from './auth';
import chat from './chat';
import info from './info';
import pushNotifications from './pushNotifications';
import subscriptions from './subscriptions';
import users from './users';
import webrtc from './webrtc';

export default combineReducers({
  app,
  auth,
  chat,
  info,
  pushNotifications,
  subscriptions,
  users,
  webrtc,
});
