import React from 'react';
import {Animated, Image, Pressable, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Video from 'react-native-video';

import {PLAY, VIDEO} from '../images';
import {colors} from '../theme';

const styles = StyleSheet.create({
  albsoluteFillCenter: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderImage: {
    height: 60,
    width: 82,
  },
  placeholderView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playImage: {
    backgroundColor: colors.black01,
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
});

const ANIMATION_DURATION = 250;

function RemoteVideo(props) {
  const {onLongPress, source} = props;
  const navigation = useNavigation();

  const placeholderOpacity = React.useRef(new Animated.Value(1)).current;
  const playerRef = React.useRef(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (playerRef.current) {
      playerRef.current.seek(0);
    }
  }, []);

  const onLoad = () => {
    if (playerRef.current) {
      playerRef.current.seek(0);
    }
    Animated.timing(placeholderOpacity, {
      duration: ANIMATION_DURATION,
      toValue: 0,
      useNativeDriver: true,
    }).start(() => setLoaded(true));
  };

  const play = React.useCallback(() => {
    navigation.navigate('VideoPlayer', {uri: source.uri});
  }, [navigation, source]);

  const videoProps = loaded
    ? props
    : {
        ...props,
        onLoad,
        ref: playerRef,
        style: {...props.style, opacity: 0, position: 'absolute'},
      };
  return (
    <Pressable onPress={play} onLongPress={onLongPress} style={styles.button}>
      {source && source.uri ? <Video {...videoProps} /> : null}
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
            source={VIDEO}
            style={styles.placeholderImage}
          />
        </Animated.View>
      )}
      <Image resizeMode="center" source={PLAY} style={styles.playImage} />
    </Pressable>
  );
}

export default React.memo(RemoteVideo);
