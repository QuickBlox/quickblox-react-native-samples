import React from 'react'
import { Image, TouchableOpacity } from 'react-native'

import { colors } from '../theme'

export default ({ onPress, imageSource }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      alignItems: 'center',
      backgroundColor: colors.primary,
      height: '100%',
      justifyContent: 'center',
      paddingHorizontal: 10,
    }}
  >
    <Image
      resizeMode="center"
      source={imageSource}
      style={{ height: 28, width: 28 }}
    />
  </TouchableOpacity>
)