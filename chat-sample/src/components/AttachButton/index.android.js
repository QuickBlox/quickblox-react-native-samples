import React from 'react';
import {
  findNodeHandle,
  Image,
  TouchableNativeFeedback,
  View,
  Modal,
  TouchableOpacity,
  Text,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {request, RESULTS} from 'react-native-permissions';

import {ATTACHMENT} from '../../images';
import {showError} from '../../NotificationService';
import styles from './styles';

const attachmentType = {
  PHOTO: 'Select photo',
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

  const [menuVisible, setMenuVisible] = React.useState(false);

  const handleMenuPress = e => {
    if (onPress) {
      const proceed = onPress();
      if (!proceed) {
        return;
      }
    }
    setMenuVisible(true);
  };

  const handleMenuItemPress = async index => {
    setMenuVisible(false);
    const key = Object.keys(attachmentType)[index];
    const type = attachmentType[key];
    switch (type) {
      case attachmentType.PHOTO:
        launchImageLibrary(imagePickerOptions, onAttachment);
        break;
      case attachmentType.CAMERA_PHOTO:
        const result = await request('android.permission.CAMERA');
        if (result === RESULTS.GRANTED) {
          launchCamera(imagePickerOptions, onAttachment);
        }
        break;
      default:
        return;
    }
  };

  return (
    <>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.SelectableBackground()}
        disabled={disabled}
        onPress={handleMenuPress}>
        <View style={styles.attachButton}>
          <Image source={ATTACHMENT} style={styles.attachButtonImage} />
        </View>
      </TouchableNativeFeedback>
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 8,
            padding: 16,
            minWidth: 200,
            elevation: 4,
          }}>
            {Object.values(attachmentType).map((label, idx) => (
              <TouchableOpacity
                key={label}
                onPress={() => handleMenuItemPress(idx)}
                style={{paddingVertical: 12}}>
                <Text style={{fontSize: 16, color: '#333'}}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
