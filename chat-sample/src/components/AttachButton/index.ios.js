import React from 'react';
import {
  ActionSheetIOS,
  findNodeHandle,
  Image,
  TouchableOpacity,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {request, RESULTS} from 'react-native-permissions';

import {ATTACHMENT} from '../../images';
import styles from './styles';

const attachmentType = {
  PHOTO: 'Select photo',
  // eslint-disable-next-line sort-keys
  CAMERA_PHOTO: 'Take Photo using camera',
  CANCEL: 'Cancel',
};

const imagePickerOptions = {
  durationLimit: 60,
  includeBase64: false,
  mediaType: 'photo',
  saveToPhotos: false,
  quality: 1,
  selectionLimit: 1,
};

export default function AttachButton(props) {
  const {disabled, onAttachment, onPress} = props;

  const buttonRef = React.useRef(null);

  const handleMenuPress = e => {
    if (onPress) {
      const proceed = onPress();
      if (!proceed) {
        return;
      }
    }
    const options = Object.keys(attachmentType).map(key => attachmentType[key]);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        anchor: findNodeHandle(buttonRef.current),
        cancelButtonIndex: options.indexOf(attachmentType.CANCEL),
        options,
        title: 'Select attachment type',
      },
      onMenuItemPress,
    );
  };

  const onMenuItemPress = index => {
    const key = Object.keys(attachmentType)[index];
    const type = attachmentType[key];
    switch (type) {
      case attachmentType.PHOTO:
        request('ios.permission.PHOTO_LIBRARY').then(result => {
          if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
            setTimeout(() => {
              launchImageLibrary(imagePickerOptions, onAttachment);
            }, 300);
          }
        });
        break;
      case attachmentType.CAMERA_PHOTO:
        request('ios.permission.CAMERA').then(result => {
          if (result === RESULTS.GRANTED) {
            setTimeout(() => {
              launchCamera(imagePickerOptions, onAttachment);
            }, 300);
          }
        });
        break;
      default:
        return;
    }
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={handleMenuPress}
      ref={buttonRef}
      style={styles.attachButton}>
      <Image source={ATTACHMENT} style={styles.attachButtonImage} />
    </TouchableOpacity>
  );
}
