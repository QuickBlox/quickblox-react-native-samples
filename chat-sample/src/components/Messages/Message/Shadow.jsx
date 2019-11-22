import React from 'react'
import { Image, Platform } from 'react-native'

import { SHADOW } from '../../../images'
import styles from './styles'

export default Platform.select({
  android: () => (
    <Image
      resizeMode="stretch"
      source={SHADOW}
      style={styles.shadowImg}
    />
  ),
  ios: () => null,
})