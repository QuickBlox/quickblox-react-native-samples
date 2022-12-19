import {StyleSheet} from 'react-native';

import {colors} from '../../../theme';

export default StyleSheet.create({
  emptyListText: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 50,
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
  itemText: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 18,
  },
  itemView: {
    alignItems: 'center',
    borderColor: colors.gray,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 4,
    paddingLeft: 8,
  },
  scrollViewContent: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingVertical: 5,
    width: '100%',
  },
});
