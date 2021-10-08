import React from 'react';
import {
  findNodeHandle,
  Image,
  TouchableNativeFeedback,
  UIManager,
  View,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {request, RESULTS} from 'react-native-permissions';

import {ATTACHMENT} from '../../images';
import {showError} from '../../NotificationService';
import styles from './styles';

const attachmentType = {
  PHOTO: 'Select photo',
  // eslint-disable-next-line sort-keys
  CAMERA_PHOTO: 'Take Photo using camera',
};

const imagePickerOptions = {
  durationLimit: 60,
  includeBase64: false,
  mediaType: 'photo',
  saveToPhotos: false,
};

export default function AttachButton(props) {
  const {disabled, onAttachment, onPress} = props;

  const buttonRef = React.useRef(null);

  const handleShowPopupError = () => {
    showError('Failed to show attachment menu');
  };

  const handleMenuPress = e => {
    if (onPress) {
      const proceed = onPress();
      if (!proceed) {
        return;
      }
    }
    const actions = Object.keys(attachmentType).map(key => attachmentType[key]);
    UIManager.showPopupMenu(
      findNodeHandle(buttonRef.current),
      actions,
      handleShowPopupError,
      onMenuItemPress,
    );
  };

  const onMenuItemPress = (item, index) => {
    const key = Object.keys(attachmentType)[index];
    const type = attachmentType[key];
    switch (type) {
      case attachmentType.PHOTO:
        launchImageLibrary(imagePickerOptions, onAttachment);
        break;
      case attachmentType.CAMERA_PHOTO:
        request('android.permission.CAMERA').then(result => {
          if (result === RESULTS.GRANTED) {
            launchCamera(imagePickerOptions, onAttachment);
          }
        });
        break;
      default:
        return;
    }
  };

  return (
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.SelectableBackground()}
      disabled={disabled}
      onPress={handleMenuPress}
      ref={buttonRef}>
      <View style={styles.attachButton}>
        <Image source={ATTACHMENT} style={styles.attachButtonImage} />
      </View>
    </TouchableNativeFeedback>
  );
}
