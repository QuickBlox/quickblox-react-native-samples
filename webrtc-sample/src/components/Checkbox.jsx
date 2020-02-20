import React from 'react'
import { Image, StyleSheet, View } from 'react-native'

import { CHECKMARK } from '../images'
import { colors } from '../theme'

const styles = StyleSheet.create({
  checkbox: {
    borderColor: colors.gray,
    borderRadius: 4,
    borderWidth: 1,
    height: 20,
    width: 20,
  },
  checkboxChecked: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 4,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  checkMark: {
    height: 12,
    resizeMode: 'contain',
    tintColor: colors.white,
    width: 12,
  },
})

export default ({ checked = false }) => (
  <View style={checked ? styles.checkboxChecked : styles.checkbox}>
    {checked ? (
      <Image source={CHECKMARK} style={styles.checkMark} />
    ) : null}
  </View>
)