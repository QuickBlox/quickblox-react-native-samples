import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {HeaderBackButton} from '@react-navigation/elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Video from 'react-native-video';

import {colors} from '../theme';

const styles = StyleSheet.create({
  absoluteFill: StyleSheet.absoluteFill,
  backButtonView: {
    alignItems: 'center',
    height: 45,
    justifyContent: 'center',
    left: 10,
    position: 'absolute',
    top: 10,
    width: 45,
    zIndex: 1,
  },
  safeArea: {
    backgroundColor: colors.black,
    flex: 1,
    width: '100%',
  },
  video: {
    height: '100%',
    width: '100%',
  },
});

function VideoPlayer({navigation, route}) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const insets = useSafeAreaInsets();

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
      {loading ? (
        <ActivityIndicator
          color={colors.primary}
          size="large"
          style={styles.absoluteFill}
        />
      ) : null}
      {error ? <Text style={styles.absoluteFill}>{error}</Text> : null}
      <Video
        controls
        onBuffer={() => setLoading(true)}
        onError={e => setError(e.error.errorString)}
        onLoad={() => setLoading(false)}
        resizeMode="contain"
        source={{uri: route.params.uri}}
        style={styles.video}
      />
    </SafeAreaView>
  );
}

export default React.memo(VideoPlayer);
