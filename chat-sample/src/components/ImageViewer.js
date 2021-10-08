import React from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {HeaderBackButton} from '@react-navigation/elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {colors} from '../theme';

const styles = StyleSheet.create({
  absoluteFill: StyleSheet.absoluteFill,
  backButtonView: {
    alignItems: 'center',
    height: 45,
    justifyContent: 'center',
    left: 10,
    position: 'absolute',
    width: 45,
    zIndex: 1,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  safeArea: {
    backgroundColor: colors.black,
    flex: 1,
    width: '100%',
  },
});

export default function ImageViewer({navigation, route}) {
  const [error, setError] = React.useState('');
  const insets = useSafeAreaInsets();

  const onLoadFail = e => {
    setError(e.nativeEvent.error);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden />
      <View style={[styles.backButtonView, {top: insets.top + 10}]}>
        <HeaderBackButton
          labelVisible={false}
          onPress={() => navigation.goBack()}
          tintColor={colors.white}
        />
      </View>
      {error ? <Text style={styles.absoluteFill}>{error}</Text> : null}
      <Image
        resizeMode="contain"
        onError={onLoadFail}
        source={{uri: route.params.uri}}
        style={styles.image}
      />
    </SafeAreaView>
  );
}
