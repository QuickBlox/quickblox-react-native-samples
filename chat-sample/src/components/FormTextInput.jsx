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

  state = { hint: '', showHint: false }

  showHint = (hint = '') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({ hint, showHint: true })
  }

  hideHint = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({ hint: '', showHint: false })
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      input: { value },
      meta: { active, error }
    } = this.props
    const { showHint } = this.state
    if (value !== nextProps.input.value ||
       active !== nextProps.meta.active ||
       error !== nextProps.meta.error ||
       showHint !== nextState.showHint) {
      if (error !== nextProps.meta.error) { // should show or hide hint
        if (!error && nextProps.meta.error && nextProps.meta.active) {
          this.showHint(nextProps.meta.error)
        }
        if (error && !nextProps.meta.error && nextProps.meta.active) {
          this.hideHint()
        }
      }
      if (active && !nextProps.meta.active) {
        this.hideHint()
      }
      if (!active && nextProps.meta.active && nextProps.meta.error) {
        this.showHint(nextProps.meta.error)
      }
      return true
    } else {
      return false
    }
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
        {this.state.showHint ? (
          <Text style={styles.hint}>{this.state.hint}</Text>
        ) : null}
      </React.Fragment>
    )
  }

}