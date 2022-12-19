import React from 'react';
import {Pressable, Text, View} from 'react-native';

import Checkbox from '../Checkbox';
import {colors} from '../../theme';
import styles from './styles';
import {generateColor} from '../../utils/utils';

function User(props) {
  const { isSelected, onSelect, selectable = false, user } = props;

  const onUserSelect = () => onSelect && onSelect(user);

  const username = user ? user.fullName || user.login || user.email : '';
  const btnStyle = isSelected
    ? [styles.userBtn, styles.userBtnSelected]
    : styles.userBtn;

  let circleBackground = colors.primaryDisabled;
  if (user && user.color) {
    circleBackground = user.color;
  } else if (user && user.id) {
    circleBackground = generateColor(user.id.toString());
  }

  const circleText = username
    .split(' ')
    .filter((str, i) => (i < 2 ? str : undefined))
    .reduce((res, val) => res + val.trim().charAt(0).toUpperCase(), '');
  return (
    <Pressable
      android_ripple={styles.userBtnRippleConfig}
      disabled={!selectable}
      onPress={onUserSelect}
      style={btnStyle}>
      <View style={[styles.circleView, { backgroundColor: circleBackground }]}>
        <Text numberOfLines={1} style={styles.circleText}>
          {circleText}
        </Text>
      </View>
      <Text numberOfLines={1} style={styles.userBtnText}>
        {username}
      </Text>
      {selectable ? <Checkbox checked={isSelected} /> : null}
    </Pressable>
  );
}

export default React.memo(User);
