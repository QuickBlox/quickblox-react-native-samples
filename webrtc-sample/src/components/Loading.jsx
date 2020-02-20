import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'

import { colors } from '../theme'

const Loading = ({ message }) => (
  <View style={{
    alignItems: 'center',
    backgroundColor: colors.primary,
    flex: 1,
    justifyContent: 'center',
    width: '100%'
  }}>
    <ActivityIndicator color={colors.white} size="large" />
    {message ? (
      <Text style={{ color: colors.white, textAlign: 'center' }}>
        {message}
      </Text>
    ) : null}
  </View>
)

Loading.navigationOptions = { title: 'Loading' }

export default Loading