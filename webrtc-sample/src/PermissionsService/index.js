import {Platform} from 'react-native';
import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import InCallManager from 'react-native-incall-manager';

const REQUIRED_PERMISSIONS =
  Platform.OS === 'ios'
    ? [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE]
    : [
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.RECORD_AUDIO,
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      ];

function isPermissionsGranted(statuses) {
  return REQUIRED_PERMISSIONS.every(
    permission =>
      statuses[permission] === RESULTS.UNAVAILABLE ||
      statuses[permission] === RESULTS.GRANTED,
  );
}

export function checkAndRequestPermissions() {
  return checkMultiple(REQUIRED_PERMISSIONS).then(statuses => {
    if (isPermissionsGranted(statuses)) {
      return true;
    } else {
      const askPermissions = REQUIRED_PERMISSIONS.filter(
        permission => statuses[permission] === RESULTS.DENIED,
      );
      if (askPermissions.length) {
        requestMultiple(REQUIRED_PERMISSIONS).then(results => {
          // activate InCallManager audio permissions, fix bug for ios when ringback sound not playing in first launch
          InCallManager.checkRecordPermission();
          if (isPermissionsGranted(results)) {
            return true;
          } else {
            return checkAndRequestPermissions();
          }
        });
      } else {
        return true;
      }
    }
  });
}
