import {Platform} from 'react-native';
import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';

const REQUIRED_PERMISSIONS =
  Platform.OS === 'ios'
    ? [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE]
    : [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.RECORD_AUDIO, PERMISSIONS.ANDROID.BLUETOOTH_CONNECT];

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
