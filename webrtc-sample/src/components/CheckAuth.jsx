import React from 'react'

import Loading from './Loading'

export default class CheckAuth extends React.PureComponent {

  INIT_FAILED_MSG = 'SDK initialization failed.\nCheck if your config is valid.'
  state = { showError: false }

  componentDidMount() {
    const { appReady, loggedIn, navigation } = this.props
    appReady && navigation.navigate(loggedIn ? 'WebRTC' : 'Login')
  }

  componentDidUpdate(prevProps) {
    const { appReady, loggedIn, navigation } = this.props
    if (appReady !== prevProps.appReady) {
      if (appReady) {
        navigation.navigate(loggedIn ? 'WebRTC' : 'Login')
      } else {
        this.setState({ showError: true })
      }
    }
  }

  render() {
    const { showError } = this.state
    return (
      <Loading message={showError ? this.INIT_FAILED_MSG : undefined} />
    )
  }

}