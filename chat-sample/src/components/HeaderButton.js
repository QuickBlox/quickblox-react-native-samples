import React from 'react';
import {Image, Pressable, StyleSheet} from 'react-native';

import {colors} from '../theme';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.transparent,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  image: {
    height: 28,
    width: 28,
  },
});

export default ({onPress, imageSource}) => (
  <Pressable onPress={onPress} style={styles.button}>
    <Image resizeMode="center" source={imageSource} style={styles.image} />
  </Pressable>
);
