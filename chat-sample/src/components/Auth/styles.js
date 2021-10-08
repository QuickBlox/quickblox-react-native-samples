import {Platform, StyleSheet} from 'react-native';

import {colors} from '../../theme';

export default StyleSheet.create({
  headerLeft: {
    flex: 1,
    width: 56,
  },
  headerText: {
    color: colors.label,
    fontSize: 17,
    paddingVertical: 25,
    textAlign: 'center',
  },
  headerTitle: {
    color: colors.white,
    fontSize: Platform.OS === 'ios' ? 17 : 20,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
  headerView: {
    width: '50%',
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
  submitError: {
    alignSelf: 'center',
    color: colors.error,
  },
  submitView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 35,
    width: '60%',
  },
  topView: {
    backgroundColor: colors.lightGray,
    flex: 1,
    width: '100%',
  },
});
