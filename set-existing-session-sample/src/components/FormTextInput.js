import React from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
} from 'react-native';

import {colors} from '../theme';

const styles = StyleSheet.create({
  hint: {
    color: colors.primaryDisabled,
    fontSize: 13,
    lineHeight: 15,
    paddingVertical: 10,
    textAlign: 'center',
  },
});

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FormTextInput(props) {
  const {activeStyle, input, meta, style, ...rest} = props;
  const {inputRef, ...inputProps} = rest;

  React.useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [meta]);

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
  );
}
