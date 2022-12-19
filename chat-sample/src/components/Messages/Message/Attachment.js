import React from 'react';
import {Image, Pressable, Linking} from 'react-native';

import RemoteImage from '../../RemoteImage';
import RemoteVideo from '../../RemoteVideo';
import {FILE} from '../../../images';
import styles from './styles';

function Attachment({attachmentType, attachmentUrl, onLongPress}) {
  const downloadAttachment = React.useCallback(() => {
    if (attachmentUrl) {
      Linking.openURL(attachmentUrl.url);
    }
  }, [attachmentUrl]);

  if (attachmentType === 'image') {
    return (
      <RemoteImage
        onLongPress={onLongPress}
        progressiveRenderingEnabled={true}
        resizeMethod="scale"
        source={{uri: attachmentUrl ? attachmentUrl.url : undefined}}
        style={styles.attachment}
      />
    );
  } else if (attachmentType === 'video') {
    return (
      <RemoteVideo
        onLongPress={onLongPress}
        paused
        resizeMode="cover"
        source={{uri: attachmentUrl ? attachmentUrl.url : undefined}}
        style={styles.attachment}
      />
    );
  } else if (attachmentType === 'file') {
    return (
      <Pressable onPress={downloadAttachment} onLongPress={onLongPress}>
        <Image source={FILE} />
      </Pressable>
    );
  }
}

export default React.memo(Attachment);
