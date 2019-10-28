import React from 'react'
import {
  Animated,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import Navigation from '../NavigationService'
import { IMAGE } from '../images'

const styles = StyleSheet.create({
  enlargeBtn: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
})

export default class RemoteImage extends React.Component {

  ANIMATION_DURATION = 250
  placeholderOpacity = new Animated.Value(1)
  state = { loaded: false }

  shouldComponentUpdate(nextProps, nextState) {
    const { source } = this.props
    const { loaded } = this.state
    return (
      source.uri !== nextProps.source.uri ||
      loaded !== nextState.loaded
    )
  }

  onLoad = () => {
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

  enlarge = () => {
    const { source } = this.props
    Navigation.navigate({
      key: source.uri,
      params: { uri: source.uri },
      routeName: 'ImageViewer'
    })
  }

  render() {
    const imageProps = this.state.loaded ? this.props : {
      ...this.props,
      style: { ...this.props.style, position: 'absolute', opacity: 0 },
      onLoad: this.onLoad
    }
    const showImage = this.props.source && !!this.props.source.uri
    return (
      <View>
        {showImage ? <Image {...imageProps} /> : null}
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
              source={IMAGE}
              style={{ height: 50, width: 50 }}
            />
          </Animated.View>
        )}
        <TouchableOpacity
          onLongPress={this.onLongPress}
          onPress={this.enlarge}
          style={styles.enlargeBtn}
        />
      </View>
    )
  }
}
