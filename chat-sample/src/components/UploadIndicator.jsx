import React from 'react'
import { View } from 'react-native'
import { Svg, Circle, Text } from 'react-native-svg'

import { colors } from '../theme'

export default props => {
  const {
    borderWidth = 2,
    color = colors.primary,
    percent,
    radius = 15,
    showText = false,
    style = {},
    textColor = colors.white,
  } = props
  const c = 2 * Math.PI * (radius - borderWidth)
  const percentage = percent < 0 ? 0 : percent > 100 ? 100 : percent
  const dashOffset = ((100 - percentage) / 100) * c
  return (
    <View style={style}>
      <Svg height={radius * 2} width={radius * 2}>
        <Circle
          cx={radius}
          cy={radius}
          fill={colors.transparent}
          r={radius - borderWidth}
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth={borderWidth}
        />
        <Circle
          cx={radius}
          cy={radius}
          fill={colors.transparent}
          r={radius - borderWidth}
          stroke={color}
          strokeDasharray={2 * Math.PI * (radius - borderWidth)}
          strokeDashoffset={dashOffset}
          strokeWidth={borderWidth}
          transform={`rotate(-90, ${radius}, ${radius})`}
        />
        {showText ? (
          <Text
            fill={textColor}
            fontSize={(radius - borderWidth) * 0.55}
            textAnchor="middle"
            x={radius * 0.85}
            y={radius * 1.2}
          >
            {percentage}%
          </Text>
        ) : null}
      </Svg>
    </View>
  )
}
