import {combineReducers} from 'redux';

import app from './app';
import auth from './auth';
import chat from './chat';
import info from './info';

export default combineReducers({
  app,
  auth,
  chat,
  info,
});