import React from 'react'
import { connect } from 'react-redux'
import { AppState, StatusBar, StyleSheet, View } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import FlashMessage from 'react-native-flash-message'

import Navigator from './Navigation'
import NavigationService from './NavigationService'
import Loading from './components/Loading'
import { connectionStateChanged } from './actionCreators'
import { appStartThunk, trackAppState, connectionStateHandler } from './thunks'
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

  NO_INTERNET = 'Seems like there is no internet connection'
  netInfoUnsubscribe

  constructor(props) {
    super(props)
    props.appStartThunk(config)
  }

  componentDidMount() {
    const {
      appStateHandler,
      connectionState,
      netInfoHandler,
    } = this.props
    NetInfo.fetch().then(netInfoState => {
      connectionState(netInfoState.isConnected)
    })
    AppState.addEventListener('change', appStateHandler)
    this.netInfoUnsubscribe = NetInfo.addEventListener(netInfoHandler)
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.props.appStateHandler)
    this.netInfoUnsubscribe && this.netInfoUnsubscribe()
  }

  render() {
    const { online } = this.props
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={colors.primary}
          barStyle="light-content"
        />
        {online ? (
          <View style={styles.navigatorView}>
            <Navigator ref={NavigationService.init} />
          </View>
        ) : (
          <Loading message={this.NO_INTERNET} />
        )}
        <FlashMessage position="bottom" />
      </View>
    )
  }

}

const mapStateToProps = ({ app }) => ({
  online: app.online
})

const mapDispatchToProps = {
  appStartThunk,
  connectionState: connectionStateChanged,
  netInfoHandler: connectionStateHandler,
  appStateHandler: trackAppState,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)