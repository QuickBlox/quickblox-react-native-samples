import {StyleSheet} from 'react-native';

import {colors} from '../../theme';

export default StyleSheet.create({
  callButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  callButtonIcon: {
    height: 28,
    resizeMode: 'center',
    width: 28,
  },
  filterIcon: {
    height: 28,
    marginRight: 10,
    resizeMode: 'center',
    width: 28,
  },
  filterInput: {
    color: colors.black,
    flex: 1,
    fontSize: 15,
    height: 44,
    lineHeight: 18,
  },
  filterResetBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  filterResetBtnText: {
    color: colors.black,
    fontSize: 28,
    lineHeight: 30,
    textAlign: 'center',
  },
  filterView: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.gray,
    elevation: 8,
    flexDirection: 'row',
    paddingHorizontal: 12,
    shadowColor: colors.primaryDisabled,
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 0.5,
    shadowRadius: 14,
    zIndex: 1,
  },
  headerLoader: {
    padding: 8,
  },
  safeArea: {
    backgroundColor: colors.primary,
    flex: 1,
    width: '100%',
  },
  selectedUsersView: {
    alignItems: 'center',
    backgroundColor: colors.white,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 8,
  },
  titleText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  userButton: {
    alignItems: 'center',
    backgroundColor: colors.whiteBackground,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  userButtonSelected: {
    backgroundColor: colors.greyedBlue,
  },
  userButtonText: {
    color: colors.black,
    flex: 1,
    fontSize: 17,
    lineHeight: 20,
  },
  userCircleText: {
    color: colors.white,
    fontSize: 17,
    lineHeight: 20,
    textAlign: 'center',
  },
  userCircleView: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginRight: 15,
    width: 40,
  },
});
