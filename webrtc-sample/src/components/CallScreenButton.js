import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

import {colors} from '../theme';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.greyedBlue,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  image: {
    height: 30,
    resizeMode: 'contain',
    width: 32,
  },
  text: {
    color: colors.white,
    fontSize: 10,
    lineHeight: 12,
    marginTop: 6,
  },
  view: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default props => {
  const {buttonStyle, image, imageStyle, onPress, text, textStyle} = props;
  const buttonStyles = buttonStyle
    ? [styles.button, buttonStyle]
    : styles.button;
  const imageStyles = imageStyle ? [styles.image, imageStyle] : styles.image;
  const textStyles = textStyle ? [styles.text, textStyle] : styles.text;
  return (
    <View style={styles.view}>
      <Pressable onPress={onPress} style={buttonStyles}>
        <Image source={image} style={imageStyles} />
      </Pressable>
      <Text style={textStyles}>{text}</Text>
    </View>
  );
};
