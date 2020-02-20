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
})
