import React from 'react'
import { connect } from 'react-redux'
import { AppState, StatusBar, StyleSheet, View } from 'react-native'
import FlashMessage from 'react-native-flash-message'

import Navigator from './Navigation'
import NavigationService from './NavigationService'
import { setupPushNotifications } from './NotificationService'
import {
  appStartThunk,
  connectAndSubscribe,
  trackAppState,
} from './thunks'
import { colors } from './theme'
import config from './QBConfig'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  navigatorView: {
    flex: 1,
    width: '100%',
  },
})

class App extends React.Component {

  constructor(props) {
    super(props)
    const { appStartThunk, connectAndSubscribe, user } = props
    appStartThunk(config).then(() => {
      if (user) {
        connectAndSubscribe()
        setupPushNotifications()
      }
    })
  }

  componentDidMount() {
    AppState.addEventListener('change', this.props.trackAppState)
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.props.trackAppState)
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={colors.primary}
          barStyle="light-content"
        />
        <View style={styles.navigatorView}>
          <Navigator ref={NavigationService.init} />
        </View>
        <FlashMessage position="bottom" />
      </View>
    )
  }

}

const mapStateToProps = ({ auth }) => ({
  user: auth.user,
})

const mapDispatchToProps = {
  appStartThunk,
  connectAndSubscribe,
  trackAppState,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)