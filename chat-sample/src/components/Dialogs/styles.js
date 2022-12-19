import {StyleSheet} from 'react-native';

import {colors} from '../../theme';

export default StyleSheet.create({
  checkboxView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  createScreenContainerView: {
    backgroundColor: colors.whiteBackground,
    flex: 1,
    width: '100%',
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
  dialogLastMessage: {
    color: colors.gray,
    fontSize: 15,
    lineHeight: 18,
  },
  dialogLastMessageDate: {
    color: colors.gray,
    fontSize: 12,
    lineHeight: 20,
  },
  dialogName: {
    color: colors.black,
    fontSize: 17,
    lineHeight: 20,
  },
  dialogNameAndLastMessageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  dialogRightView: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  dialogsList: {
    backgroundColor: colors.whiteBackground,
  },
  headerButton: {
    color: colors.white,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    padding: 10,
  },
  headerButtonImage: {
    tintColor: colors.white,
    height: 28,
    resizeMode: 'center',
    width: 28,
  },
  headerButtonText: {
    color: colors.white,
    fontSize: 17,
    lineHeight: 20,
  },
  headerButtonsView: {
    flexDirection: 'row',
  },
  titleSmallText: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 15,
    opacity: 0.6,
  },
  titleText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: 'bold',
    lineHeight: 20,
    textAlign: 'center',
  },
  titleView: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  unreadMsgBadge: {
    alignItems: 'center',
    backgroundColor: colors.lightGreen,
    borderRadius: 10,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  unreadMsgText: {
    color: colors.white,
    fontSize: 10,
    textAlign: 'center',
  },
});
