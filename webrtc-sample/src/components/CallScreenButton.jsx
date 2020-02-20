import React from 'react'
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native'

import { colors } from '../theme'

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    justifyContent: 'center',
  },
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
})

const Button = Platform.select({
  android: ({ children, style, ...props }) => (
    <TouchableNativeFeedback {...props}>
      <View style={style}>
        {children}
      </View>
    </TouchableNativeFeedback>
  ),
  ios: TouchableOpacity,
})

export default props => (
  <View style={styles.view}>
    <Button
      onPress={props.onPress}
      style={[styles.button, props.buttonStyle]}
    >
      <Image
        source={props.image}
        style={[styles.image, props.imageStyle]}
      />
    </Button>
    <Text style={[styles.text, props.textStyle]}>
      {props.text}
    </Text>
  </View>
)
