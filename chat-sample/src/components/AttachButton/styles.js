import {StyleSheet} from 'react-native';
import {colors} from '../../theme';


export default StyleSheet.create({
  attachButton: {
    tintColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  attachButtonImage: {
    tintColor: colors.primary,
    height: 30,
    resizeMode: 'contain',
    width: 30,
  },
});
