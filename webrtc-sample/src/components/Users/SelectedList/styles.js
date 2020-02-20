import { StyleSheet } from 'react-native'

import { colors } from '../../../theme'

export default StyleSheet.create({
  scrollViewContent: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingVertical: 5,
    width: '100%',
  },
  emptyListText: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 50,
  },
  itemView: {
    alignItems: 'center',
    borderColor: colors.gray,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 8,
    margin: 4,
  },
  itemText: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 18,
  },
  itemRemoveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 7,
  },
  itemRemoveIcon: {
    height: 10,
    resizeMode: 'contain',
    width: 10,
  },
})