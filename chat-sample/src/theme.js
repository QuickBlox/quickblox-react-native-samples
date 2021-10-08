import {StyleSheet} from 'react-native';

export const colors = {
  black: '#000000',
  black01: 'rgba(0, 0, 0, 0.1)',
  error: '#ff0000',
  gray: '#6c7a92',
  greyedBlue: '#d9e3f7',
  inputShadow: '#d8e5ff',
  label: '#333333',
  lightGray: '#eeeeee',
  lightGreen: '#00cc4c',
  primary: '#3978fc',
  primaryDisabled: '#99a9c6',
  transparent: 'transparent',
  white: '#ffffff',
  whiteBackground: '#f4f6f9',
};

export const navigationHeader = {
  headerStyle: {
    backgroundColor: colors.primary,
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: {height: 4, width: 0},
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  headerTintColor: colors.white,
  headerTitleAlign: 'center',
  headerTitleStyle: {fontWeight: 'bold'},
  headerTopInsetEnabled: false,
};

export const styles = StyleSheet.create({
  formControlView: {
    paddingHorizontal: 16,
    paddingTop: 16,
    width: '100%',
  },
  headerButtonStub: {
    width: 50,
  },
  label: {
    color: colors.label,
    fontSize: 13,
    opacity: 0.5,
    paddingBottom: 11,
  },
  safeArea: {
    backgroundColor: colors.primary,
    flex: 1,
    width: '100%',
  },
  textInput: {
    backgroundColor: colors.white,
    borderColor: colors.white,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    color: colors.black,
    elevation: 3,
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: colors.inputShadow,
    shadowOffset: {height: 4, width: 0},
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  textInputActive: {
    backgroundColor: colors.white,
    borderColor: colors.white,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    color: colors.black,
    elevation: 14,
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: colors.primaryDisabled,
    shadowOffset: {height: 8, width: 0},
    shadowOpacity: 1,
    shadowRadius: 6,
  },
});

export default {
  colors,
  navigationHeader,
  styles,
};
