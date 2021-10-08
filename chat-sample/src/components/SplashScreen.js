import React from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {SPLASH_LOGO} from '../images';
import {colors} from '../theme';

const styles = StyleSheet.create({
  centerView: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 100,
    width: 100,
  },
  message: {
    color: colors.white,
    textAlign: 'center',
  },
  safeArea: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 15,
    width: '100%',
  },
  text: {
    color: colors.white,
    fontSize: 18,
    marginTop: 50,
  },
});

export default ({message}) => (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.centerView}>
      <Image source={SPLASH_LOGO} style={styles.image} />
    </View>
    <ActivityIndicator color={colors.white} size="large" />
    {message ? <Text style={styles.message}>{message}</Text> : null}
    <Text
      allowFontScaling={true}
      ellipsizeMode="tail"
      numberOfLines={1}
      style={styles.text}>
      React Native Chat Sample
    </Text>
  </SafeAreaView>
);
