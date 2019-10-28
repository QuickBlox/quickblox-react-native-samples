import { StyleSheet} from 'react-native'

import { colors } from '../../theme'

export default StyleSheet.create({
  topView: {
    backgroundColor: colors.lightGray,
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  formControlView: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    width: '100%',
  },
  header: {
    color: colors.label,
    fontSize: 17,
    paddingVertical: 25,
    textAlign: 'center',
  },
  label: {
    color: colors.label,
    fontSize: 13,
    opacity: 0.5,
    paddingBottom: 11,
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
    shadowOffset: { height: 4, width: 0 },
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
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  submitBtn: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: 4,
    justifyContent: 'center',
    marginTop: 35,
    paddingVertical: 12,
    width: '50%',
  },
  submitBtnDisabled: {
    backgroundColor: colors.primaryDisabled
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 20,
  },
})