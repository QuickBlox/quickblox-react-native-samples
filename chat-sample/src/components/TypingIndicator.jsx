import React from 'react'
import { StyleSheet, Text } from 'react-native'

import { colors } from '../theme'

const styles = StyleSheet.create({
  typingText: {
    backgroundColor: colors.whiteBackground,
    color: colors.gray,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 15,
  },
})

export default ({ typing, style }) => (
  <Text style={[styles.typingText, style]}>
    {typing}
  </Text>
)
