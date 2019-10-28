import { StyleSheet } from 'react-native'

import { colors } from '../../theme'

export default StyleSheet.create({
  safeArea: {
    backgroundColor: colors.primary,
    flex: 1,
    width: '100%',
  },
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
})