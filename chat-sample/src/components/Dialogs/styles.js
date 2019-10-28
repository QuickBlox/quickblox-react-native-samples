import { StyleSheet } from 'react-native'

import { colors } from '../../theme'

export default StyleSheet.create({
  titleView: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  titleText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  titleSmallText: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 15,
    opacity: 0.6,
  },
  headerButton: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerButtonText: {
    color: colors.white,
    fontSize: 17,
    lineHeight: 20,
  },
  dialogsList: {
    backgroundColor: colors.whiteBackground,
  },
  dialogBtn: {
    flexDirection: 'row',
    padding: 10,
  },
  dialogBtnSelected: {
    backgroundColor: colors.greyedBlue,
  },
  dialogCircle: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginRight: 10,
    width: 40,
  },
  dialogCircleText: {
    color: colors.white,
    fontSize: 17,
    lineHeight: 20,
  },
  dialogName: {
    color: colors.black,
    fontSize: 17,
    lineHeight: 20,
  },
  dialogLastMessage: {
    color: colors.gray,
    fontSize: 15,
    lineHeight: 18,
  },
  dialogRightView: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  checkboxView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  dialogLastMessageDate: {
    color: colors.gray,
    fontSize: 12,
    lineHeight: 20,
  },
  safeArea: {
    backgroundColor: colors.primary,
    flex: 1,
    width: '100%',
  },
  unreadMsgBadge: {
    alignItems: 'center',
    backgroundColor: colors.lightGreen,
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  unreadMsgText: {
    color: colors.white,
    fontSize: 11,
    textAlign: 'center',
  },
})