import {showMessage} from 'react-native-flash-message';
import PushNotification, {Importance} from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform} from 'react-native';

import {saveToken} from './actionCreators';
import {store} from './store';
import {colors} from './theme';

const NOTIFICATION_CHANNEL_ID = 'qb-rn-chat';

/**
 * Show error message with title and description (optional)
 * @param {string} error
 * @param {string=} description
 */
export const showError = (error, description) =>
  showMessage({
    description,
    message: error,
    type: 'danger',
  });

/**
 * Show success message with title and description (optional)
 * @param {string} message
 * @param {string=} description
 */
export const showSuccess = (message, description) =>
  showMessage({
    backgroundColor: colors.primary,
    description,
    message,
    type: 'success',
  });

export const setupPushNotifications = () => {
  PushNotification.configure({
    // (required) Called when a remote or local notification is opened or received
    onNotification: notification => {
      // process the notification
      if (Platform.OS === 'ios') {
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      } else {
        const {local = false, message} = notification.data;
        if (!local) {
          PushNotification.localNotification({
            channelId: NOTIFICATION_CHANNEL_ID, // (required) channelId, if the channel doesn't exist, notification will not trigger.
            color: colors.primary, // (optional) default: system default
            message, // (required)
            userInfo: {...notification.data, local: true}, // (optional) default: {} (using null throws a JSON value '<null>' error)
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
          });
        }
      }
    },
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: ({token}) => {
      store.dispatch(saveToken(token));
      const channelOptions = {
        channelDescription: 'A channel for QuickBlox chat notifications', // (optional) default: undefined.
        channelId: NOTIFICATION_CHANNEL_ID, // (required)
        channelName: 'Chat', // (required)
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        playSound: true, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      };
      PushNotification.createChannel(
        channelOptions,
        created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
      );
    },
    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: err => {
      __DEV__ && console.error(err.message, err);
    },

    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    popInitialNotification: true,
    requestPermissions: true,
  });
};
