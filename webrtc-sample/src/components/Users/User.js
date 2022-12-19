import React from 'react';
import {Pressable, Text, View} from 'react-native';

import Checkbox from '../Checkbox';
import styles from './styles';
import {colors} from '../../theme';

function User(props) {
  const {isSelected, onSelect, selectable = false, user} = props;

  const onUserSelect = () => onSelect && onSelect(user);

  const username = user ? user.fullName || user.login || user.email : '';
  const btnStyle = isSelected
    ? [styles.userButton, styles.userButtonSelected]
    : styles.userButton;
  const circleBackground = user ? user.color : colors.primaryDisabled;
  const circleText = username.trim().charAt(0).toUpperCase();
  return (
    <Pressable
      android_ripple={{color: colors.primary}}
      disabled={!selectable}
      onPress={onUserSelect}
      style={btnStyle}>
      <View
        style={[styles.userCircleView, {backgroundColor: circleBackground}]}>
        <Text numberOfLines={1} style={styles.userCircleText}>
          {circleText}
        </Text>
      </View>
      <Text numberOfLines={1} style={styles.userButtonText}>
        {username}
      </Text>
      {selectable ? <Checkbox checked={isSelected} /> : null}
    </Pressable>
  );
}

export default React.memo(User);
