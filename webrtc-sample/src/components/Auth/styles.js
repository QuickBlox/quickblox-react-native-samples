import {Platform, StyleSheet} from 'react-native';

import {colors} from '../../theme';

export default StyleSheet.create({
  formControlView: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    width: '100%',
  },
  headerButtonStub: {
    width: 50,
  },
  headerText: {
    color: colors.label,
    fontSize: 17,
    paddingVertical: 25,
    textAlign: 'center',
  },
  headerTitleText: {
    color: colors.white,
    fontSize: Platform.OS === 'ios' ? 17 : 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerView: {
    width: '50%',
  },
  label: {
    color: colors.label,
    fontSize: 13,
    opacity: 0.5,
    paddingBottom: 11,
  },
  labelError: {
    alignSelf: 'center',
    color: colors.error,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContainer: {
    alignItems: 'center',
  },
  submitBtn: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 4,
    justifyContent: 'center',
    paddingVertical: 12,
    shadowColor: colors.primary,
    shadowOffset: {height: 4, width: 0},
    shadowOpacity: 1,
    shadowRadius: 4,
    width: '100%',
  },
  submitBtnDisabled: {
    backgroundColor: colors.primaryDisabled,
    shadowOpacity: 0,
  },
  submitBtnDisabledShadow: {
    opacity: 0,
  },
  submitBtnShadow: {
    height: '190%',
    left: '-14%',
    position: 'absolute',
    resizeMode: 'stretch',
    top: '-20%',
    width: '120%',
    zIndex: -1,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 20,
  },
  submitView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 35,
    width: '60%',
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
  topView: {
    backgroundColor: colors.lightGray,
    flex: 1,
    width: '100%',
  },
});
