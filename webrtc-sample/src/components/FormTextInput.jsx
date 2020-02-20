import React from 'react'
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
} from 'react-native'

import { colors } from '../theme'

const styles = StyleSheet.create({
  hint: {
    color: colors.primaryDisabled,
    fontSize: 13,
    lineHeight: 15,
    paddingVertical: 10,
    textAlign: 'center',
  },
})

if (Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default class FormTextInput extends React.Component {

  shouldComponentUpdate(nextProps) {
    const { input, meta } = this.props
    if (meta.touched !== nextProps.meta.touched ||
        meta.active !== nextProps.meta.active ||
        meta.error !== nextProps.meta.error) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    }
    return (
      input.value !== nextProps.input.value ||
      meta.touched !== nextProps.meta.touched ||
      meta.active !== nextProps.meta.active ||
      meta.error !== nextProps.meta.error
    )
  }

  render() {
    const { activeStyle, input, meta, style, ...rest } = this.props
    const { inputRef, ...inputProps } = rest
    return (
      <React.Fragment>
        <TextInput
          {...inputProps}
          onBlur={input.onBlur}
          onChangeText={input.onChange}
          onFocus={input.onFocus}
          ref={inputRef}
          value={input.value}
          style={meta.active && activeStyle ? activeStyle : style}
        />
        {(meta.touched || meta.active) && meta.error ? (
          <Text style={styles.hint}>{meta.error}</Text>
        ) : null}
      </React.Fragment>
    )
  }

}
