import VoipPushNotification from 'react-native-voip-push-notification';
import {requestNotifications} from 'react-native-permissions';
import {showMessage} from 'react-native-flash-message';
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

// called when Token is generated (iOS and Android)
const onTokenRegister = token => {
  store.dispatch(saveToken(token));
};

// Called when a remote or local notification is opened or received
const onNotification = notification => {
  // process the notification
  try {
    const session = {
      id: notification.sessionID,
      initiatorId: isNaN(parseInt(notification.initiatorId, 10))
        ? undefined
        : parseInt(notification.initiatorId, 10),
      opponentsIds: notification.opponentsIDs.split(',').map(Number),
      state: QB.webrtc.RTC_SESSION_STATE.NEW,
      contactIdentifier: notification.contactIdentifier,
      timestamp: notification.timestamp,
      type: isNaN(parseInt(notification.conferenceType, 10))
        ? QB.webrtc.RTC_SESSION_TYPE.AUDIO
        : parseInt(notification.conferenceType, 10),
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
  // VoipPushNotification.onVoipNotificationCompleted(notification.uuid)
};

// this will fire when there are events occured before js bridge initialized
// use this event to execute your event handler manually by event type
const didLoadWithEvents = events => {
  if (!events || !Array.isArray(events) || events.length < 1) {
    return;
  }
  for (let voipPushEvent of events) {
    const {name, data} = voipPushEvent;
    if (
      name === VoipPushNotification.RNVoipPushRemoteNotificationsRegisteredEvent
    ) {
      onTokenRegister(data);
    } else if (
      name === VoipPushNotification.RNVoipPushRemoteNotificationReceivedEvent
    ) {
      onNotification(data);
    }
  }
};

export const setupPushNotifications = () => {
  VoipPushNotification.addEventListener('register', onTokenRegister);
  VoipPushNotification.addEventListener('notification', onNotification);
  VoipPushNotification.addEventListener('didLoadWithEvents', didLoadWithEvents);

  requestNotifications(['alert', 'sound']);
};
