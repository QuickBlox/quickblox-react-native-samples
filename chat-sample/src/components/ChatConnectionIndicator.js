import React from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Platform,
  StyleSheet,
  Text,
} from 'react-native';

import {CHECKMARK} from '../images';
import {colors} from '../theme';

const styles = StyleSheet.create({
  checkmarkImage: {
    height: 18,
    resizeMode: 'contain',
    tintColor: colors.white,
    width: 50,
  },
  containerView: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    flexDirection: 'row',
    height: 80,
    justifyContent: 'center',
    left: 0,
    paddingHorizontal: 15,
    position: 'absolute',
    right: 0,
    top: -80,
  },
  loader: {
    width: 50,
  },
  textIconStyle: {
    fontSize: 20,
    width: 50,
  },
  textStyle: {
    color: colors.white,
    flex: 1,
    fontSize: 15,
  },
});

function ChatConnectionIndicator(props) {
  const {connected, connecting} = props;

  const scale = React.useRef(new Animated.Value(0)).current;
  const headerHeight = Platform.select({
    android: 130,
    ios: 140,
  });

  React.useEffect(() => {
    if (connected) {
      Animated.timing(scale, {
        duration: 500,
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scale, {
        duration: 500,
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [connected, connecting, scale]);

  const translateY = scale.interpolate({
    inputRange: [0, 1],
    outputRange: [0, headerHeight],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.containerView,
        {
          opacity: scale,
          transform: [{translateY}],
        },
      ]}>
      {connecting ? (
        <React.Fragment>
          <ActivityIndicator color={colors.white} style={styles.loader} />
          <Text style={styles.textStyle}>Connecting to chat</Text>
        </React.Fragment>
      ) : connected ? (
        <React.Fragment>
          <Image source={CHECKMARK} style={styles.checkmarkImage} />
          <Text style={styles.textStyle}>Connected</Text>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Text style={styles.textIconStyle}>⚠️</Text>
          <Text style={styles.textStyle}>Not connected to chat</Text>
        </React.Fragment>
      )}
    </Animated.View>
  );
}

export default React.memo(ChatConnectionIndicator);
