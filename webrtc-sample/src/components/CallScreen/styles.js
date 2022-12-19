import {StyleSheet} from 'react-native';

import {colors} from '../../theme';

export default StyleSheet.create({
  buttonActive: {
    backgroundColor: '#6d7c94',
  },
  buttonImage: {
    tintColor: '#6d7c94',
  },
  buttonImageActive: {
    tintColor: colors.inputShadow,
  },
  buttons: {
    alignItems: 'center',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    left: 0,
    padding: 5,
    position: 'absolute',
    right: 0,
    width: '100%',
    zIndex: 1,
  },
  circleText: {
    color: colors.white,
    fontSize: 25,
    lineHeight: 30,
    textAlign: 'center',
  },
  circleView: {
    alignItems: 'center',
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    marginBottom: 16,
    width: 60,
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.darkBackground,
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  dialingScreenView: {
    flex: 1,
    width: '100%',
  },
  opponentView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    width: '50%',
    zIndex: 1,
  },
  opponentViewFullWidth: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    width: '100%',
  },
  opponentsContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 100,
  },
  statusText: {
    color: '#b3bed4',
    fontSize: 15,
    lineHeight: 18,
  },
  usernameText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 20,
  },
  videosContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
});
