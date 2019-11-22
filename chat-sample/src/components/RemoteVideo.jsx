import React from 'react'
import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import Video from 'react-native-video'

import Navigation from '../NavigationService'
import { PLAY, VIDEO } from '../images'

const styles = StyleSheet.create({
  playBtn: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
  },
  playImg: {
    height: 28,
    width: 28,
  },
})

export default class RemoteImage extends React.PureComponent {

  ANIMATION_DURATION = 250
  placeholderOpacity = new Animated.Value(1)
  state = { loaded: false }

  onLoad = () => {
    if (Platform.OS === 'android' && this.refs.player) {
      this.refs.player.seek(0)
    }
    Animated
      .timing(this.placeholderOpacity, {
        toValue: 0,
        duration: this.ANIMATION_DURATION,
        useNativeDriver: true,
      })
      .start(() => this.setState({ loaded: true }))
  }

  onLongPress = e => {
    if (this.props.onLongPress) {
      this.props.onLongPress(e)
    }
  }

  play = () => {
    const { source } = this.props
    Navigation.navigate({
      key: source.uri,
      params: { uri: source.uri },
      routeName: 'VideoPlayer'
    })
  }

  render() {
    const videoProps = this.state.loaded ? this.props : {
      ...this.props,
      ref: 'player',
      style: { ...this.props.style, position: 'absolute', opacity: 0 },
      onLoad: this.onLoad
    }
    return (
      <View>
        {videoProps.source.uri ? (
          // used here only to display thumbnail and pre-load remote video
          <Video {...videoProps} paused />
        ) : null}
        {this.state.loaded ? null : (
          <Animated.View pointerEvents="none" style={{
            ...this.props.style,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: this.placeholderOpacity,
          }}>
            <Image
              pointerEvents="none"
              resizeMode="contain"
              source={VIDEO}
              style={{ height: 60, width: 82 }}
            />
          </Animated.View>
        )}
        <TouchableOpacity
          onLongPress={this.onLongPress}
          onPress={this.play}
          style={styles.playBtn}
        >
          <Image source={PLAY} style={styles.playImg} />
        </TouchableOpacity>
      </View>
    )
  }
}
