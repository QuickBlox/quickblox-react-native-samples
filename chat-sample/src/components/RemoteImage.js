import React from 'react';
import {Animated, Image, Pressable, StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {IMAGE} from '../images';

const styles = StyleSheet.create({
  albsoluteFillCenter: {
    ...StyleSheet.absoluteFillObject,
    textAlign: 'center',
    zIndex: 1,
  },
  placeholderImage: {
    height: 50,
    width: 50,
  },
  placeholderView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ANIMATION_DURATION = 250;

function RemoteImage(props) {
  const {onLongPress, source} = props;
  const navigation = useNavigation();

  const placeholderOpacity = React.useRef(new Animated.Value(1)).current;
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState('');

  const onLoad = () => {
    Animated.timing(placeholderOpacity, {
      duration: ANIMATION_DURATION,
      toValue: 0,
      useNativeDriver: true,
    }).start(() => setLoaded(true));
  };

  const onError = e => {
    setLoaded(true);
    setError(e.nativeEvent.error);
  };

  const enlarge = React.useCallback(() => {
    navigation.navigate('ImageViewer', {uri: source.uri});
  }, [navigation, source]);

  const imageProps = loaded
    ? props
    : {
        ...props,
        onError,
        onLoad,
        style: {...props.style, opacity: 0, position: 'absolute'},
      };
  return (
    <Pressable onPress={enlarge} onLongPress={onLongPress}>
      {source && source.uri ? <Image {...imageProps} /> : null}
      {loaded ? null : (
        <Animated.View
          pointerEvents="none"
          style={[
            props.style,
            styles.placeholderView,
            {opacity: placeholderOpacity},
          ]}>
          <Image
            pointerEvents="none"
            resizeMode="contain"
            source={IMAGE}
            style={styles.placeholderImage}
          />
        </Animated.View>
      )}
      {error ? <Text style={styles.albsoluteFillCenter}>{error}</Text> : null}
    </Pressable>
  );
}

export default React.memo(RemoteImage);
