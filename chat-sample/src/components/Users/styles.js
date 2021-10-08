import {StyleSheet} from 'react-native';

import {colors} from '../../theme';

export default StyleSheet.create({
  circleText: {
    color: colors.white,
    fontSize: 17,
    lineHeight: 20,
    textAlign: 'center',
  },
  circleView: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginRight: 15,
    width: 40,
  },
  filterInput: {
    color: colors.black,
    flex: 1,
    fontSize: 15,
    height: 44,
    lineHeight: 18,
  },
  filterView: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.gray,
    elevation: 8,
    flexDirection: 'row',
    paddingHorizontal: 12,
    shadowColor: colors.primaryDisabled,
    shadowOffset: {height: 4, width: 0},
    shadowOpacity: 1,
    shadowRadius: 4,
    zIndex: 1,
  },
  icon: {
    height: 28,
    marginRight: 10,
    resizeMode: 'center',
    width: 28,
  },
  noUsersText: {
    color: colors.label,
    fontSize: 17,
    lineHeight: 20,
  },
  noUsersView: {
    alignItems: 'center',
    backgroundColor: colors.whiteBackground,
    justifyContent: 'center',
    padding: 25,
  },
  resetFilterBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  resetFilterBtnText: {
    color: colors.black,
    fontSize: 28,
    lineHeight: 30,
    textAlign: 'center',
  },
  userBtn: {
    alignItems: 'center',
    backgroundColor: colors.whiteBackground,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  userBtnRippleConfig: {
    color: colors.primary,
  },
  userBtnSelected: {
    backgroundColor: colors.greyedBlue,
  },
  userBtnText: {
    color: colors.black,
    flex: 1,
    fontSize: 17,
    lineHeight: 20,
  },
});
