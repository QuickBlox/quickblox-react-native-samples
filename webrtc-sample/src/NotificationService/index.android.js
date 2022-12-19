import {showMessage} from 'react-native-flash-message';
import PushNotification from 'react-native-push-notification';
import QB from 'quickblox-react-native-sdk';

import {
  appStart,
  callKeepIncomingCall,
  chatConnectAndSubscribe,
  saveToken,
} from '../actionCreators';
import {store} from '../store';
import {colors} from '../theme';
import config from '../QBConfig';

/**
 * Show error message with title and description (optional)
 * @param {string} error
 * @param {string=} description
 */
export const showError = (error, description) =>
  showMessage({
    type: 'danger',
    message: error,
    description,
  });

/**
 * Show success message with title and description (optional)
 * @param {string} message
 * @param {string=} description
 */
export const showSuccess = (message, description) =>
  showMessage({
    type: 'success',
    backgroundColor: colors.primary,
    message,
    description,
  });

const onRegister = ({token}) => {
  store.dispatch(saveToken(token));
};

const onRegistrationError = error => {
  __DEV__  && console.warn(error.message, error);
};

const onNotification = notification => {
  if (notification.foreground === false) {
    // process the notification
    if (typeof notification.data === 'object') {
      try {
        const session = {
          id: notification.data.sessionID,
          initiatorId: isNaN(parseInt(notification.data.initiatorId, 10))
            ? undefined
            : parseInt(notification.data.initiatorId, 10),
          opponentsIds: notification.data.opponentsIDs.split(',').map(Number),
          state: QB.webrtc.RTC_SESSION_STATE.NEW,
          contactIdentifier: notification.data.contactIdentifier,
          timestamp: notification.data.timestamp,
          type: isNaN(parseInt(notification.data.conferenceType, 10))
            ? QB.webrtc.RTC_SESSION_TYPE.AUDIO
            : parseInt(notification.data.conferenceType, 10),
        };
        const isValidSession =
          typeof session.id === 'string' &&
          typeof session.initiatorId === 'number' &&
          Array.isArray(session.opponentsIds) &&
          session.opponentsIds.length;
        if (isValidSession) {
          store.dispatch(appStart(config));
          store.dispatch(chatConnectAndSubscribe());
          store.dispatch(callKeepIncomingCall({session}));
        }
      } catch (e) {
        __DEV__ && console.warn('Failed to parse notification data: ', e);
      }
    }
  }
};

export const setupPushNotifications = () => {
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister,
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification,
    onRegistrationError,
    popInitialNotification: true,
    requestPermissions: true,
  });
};
