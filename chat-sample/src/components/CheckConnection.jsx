import React from 'react'

import Loading from './Loading'

export default class CheckAuth extends React.PureComponent {

  componentDidMount() {
    const {
      connectAndSubscribe,
      connected,
      loading,
      navigation,
    } = this.props
    if (!connected && !loading) {
      connectAndSubscribe()
    } else {
      if (connected && !loading) {
        navigation.navigate('Main')
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { connected, navigation } = this.props
    if (connected !== prevProps.connected) {
      if (connected) {
        navigation.navigate('Main')
      }
    }
  }

  render() {
    return (
      <Loading />
    )
  }

}