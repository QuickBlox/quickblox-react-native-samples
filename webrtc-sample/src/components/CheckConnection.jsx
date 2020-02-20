import React from 'react'

import Loading from './Loading'

export default class CheckAuth extends React.PureComponent {

  componentDidMount() {
    this.checkConnectionAndRedirect()
  }

  componentDidUpdate(prevProps) {
    const { connected, loading } = this.props
    if (connected !== prevProps.connected || loading !== prevProps.loading) {
      this.checkConnectionAndRedirect()
    }
  }

  checkConnectionAndRedirect = () => {
    const {
      connectAndSubscribe,
      connected,
      loading,
      navigation,
      session,
    } = this.props
    if (!connected && !loading) {
      connectAndSubscribe()
    } else {
      if (connected && !loading) {
        navigation.navigate(session ? 'CallScreen' : 'Main')
      }
    }
  }

  render() {
    return (
      <Loading />
    )
  }

}