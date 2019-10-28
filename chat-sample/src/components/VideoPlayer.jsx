import React from 'react'
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'
import { HeaderBackButton } from 'react-navigation-stack'
import Video from 'react-native-video'

import { colors } from '../theme'

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.black,
    flex: 1,
    width: '100%',
  },
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
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  video: {
    height: '100%',
    width: '100%',
  },
})

const VideoPlayer = ({ navigation }) => {
  let loading = true
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden />
      <View style={styles.backButtonView}>
        <HeaderBackButton
          onPress={() => navigation.goBack()}
          tintColor={colors.white}
        />
      </View>
      {loading ? (
        <ActivityIndicator
          color={colors.primary}
          size="large"
          style={styles.loader}
        />
       ) : null}
      <Video
        resizeMode="contain"
        onBuffer={() => { loading = true }}
        onLoad={() => { loading = false }}
        source={{ uri: navigation.getParam('uri') }}
        style={styles.video}
      />
    </SafeAreaView>
  )
}

VideoPlayer.navigationOptions = () => ({
  header: null
})

export default VideoPlayer