import React from 'react'
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import QB from 'quickblox-react-native-sdk'
import WebRTCView from 'quickblox-react-native-sdk/RTCView'
import InCallManager from 'react-native-incall-manager'

import CallScreenButton from './CallScreenButton'
import NavigationService from '../NavigationService'
import { colors } from '../theme'
import Icons from '../images'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.darkBackground,
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  opponentsContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 100,
  },
  videosContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  opponentView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    width: '50%',
  },
  circleView: {
    alignItems: 'center',
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    marginBottom: 16,
    width: 60,
  },
  circleText: {
    color: colors.white,
    fontSize: 25,
    lineHeight: 30,
    textAlign: 'center',
  },
  buttons: {
    alignItems: 'center',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    left: 0,
    padding: 5,
    position: 'absolute',
    right: 0,
    width: '100%',
  },
  usernameText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 20,
  },
  statusText: {
    color: '#b3bed4',
    fontSize: 15,
    lineHeight: 18,
  },
  buttonActive: {
    backgroundColor: '#6d7c94',
  },
  buttonImageActive: {
    tintColor: colors.inputShadow,
  },
})

const PeerStateText = {
  [QB.webrtc.RTC_PEER_CONNECTION_STATE.NEW]: 'Calling...',
  [QB.webrtc.RTC_PEER_CONNECTION_STATE.CONNECTED]: 'Connected',
  [QB.webrtc.RTC_PEER_CONNECTION_STATE.DISCONNECTED]: 'Disconnected',
  [QB.webrtc.RTC_PEER_CONNECTION_STATE.FAILED]: 'Failed to connect',
  [QB.webrtc.RTC_PEER_CONNECTION_STATE.CLOSED]: 'Connection closed',
}

export default class CallScreen extends React.Component {

  isIncomingCall = this.props.session.initiatorId !== this.props.currentUser.id
  state = {
    loudspeaker: false,
    muteAudio: false,
    muteVideo: false,
  }

  componentDidMount() {
    const { getUsers, onCall, session } = this.props
    if (session) {
      if (!onCall) {
        const startOpts = {
          ringback: '_BUNDLE_',
          media: session.type === QB.webrtc.RTC_SESSION_TYPE.AUDIO ?
            'audio' :
            'video'
        }
        if (this.isIncomingCall) {
          InCallManager.startRingtone()
        } else {
          InCallManager.start(startOpts)
        }
      }
      const userIds = session
        .opponentsIds
        .concat(session.initiatorId)
        .join()
      getUsers({
        append: true,
        filter: {
          field: QB.users.USERS_FILTER.FIELD.ID,
          type: QB.users.USERS_FILTER.TYPE.NUMBER,
          operator: QB.users.USERS_FILTER.OPERATOR.IN,
          value: userIds
        }
      })
    }
  }

  componentDidUpdate() {
    const { session } = this.props
    if (!session) {
      NavigationService.navigate({ routeName: 'Main' })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { loudspeaker, muteAudio, muteVideo } = this.state
    const { caller, onCall, opponentsLeftCall, session, users } = this.props
    if (onCall !== nextProps.onCall) {
      if (!onCall && nextProps.onCall && !this.isIncomingCall) {
        InCallManager.stopRingback()
      }
    }
    if (session && !nextProps.session && !onCall) {
      if (this.isIncomingCall) {
        InCallManager.stopRingtone()
      } else {
        InCallManager.stop({ busytone: '_BUNDLE_' })
      }
    }
    return (
      onCall !== nextProps.onCall ||
      users.length !== nextProps.users.length ||
      session !== nextProps.session ||
      loudspeaker !== nextProps.loudspeaker ||
      muteAudio !== nextState.muteAudio ||
      muteVideo !== nextState.muteVideo ||
      opponentsLeftCall.length !== nextProps.opponentsLeftCall.length ||
      caller !== nextProps.caller
    )
  }

  componentWillUnmount() {
    InCallManager.stop()
  }

  acceptHandler = () => {
    const { accept, session } = this.props
    accept({ sessionId: session.id })
    InCallManager.stopRingtone()
  }

  callEndHandler = () => {
    const { hangUp, reject, session } = this.props
    if (this.isIncomingCall && session.state < QB.webrtc.RTC_SESSION_STATE.CONNECTED) {
      reject({ sessionId: session.id })
    } else {
      hangUp({ sessionId: session.id })
    }
  }

  toggleAudio = () => {
    const { muteAudio } = this.state
    const { session, toggleAudio } = this.props
    toggleAudio({ sessionId: session.id, enable: muteAudio })
    this.setState({ muteAudio: !muteAudio })
  }

  toggleVideo = () => {
    const { muteVideo } = this.state
    const { session, toggleVideo } = this.props
    toggleVideo({ sessionId: session.id, enable: muteVideo })
    this.setState({ muteVideo: !muteVideo })
  }

  switchAudioOutput = () => {
    const { loudspeaker } = this.state
    const { switchAudio } = this.props
    const output = loudspeaker ?
      QB.webrtc.AUDIO_OUTPUT.EARSPEAKER :
      QB.webrtc.AUDIO_OUTPUT.LOUDSPEAKER
    switchAudio({ output })
    this.setState({ loudspeaker: !loudspeaker })
  }

  switchCamera = () => {
    const { session, switchCamera } = this.props
    switchCamera({ sessionId: session.id })
  }

  getOpponentsCircles = () => {
    const { currentUser, peers, session, users } = this.props
    const userIds = session
      .opponentsIds
      .concat(session.initiatorId)
      .filter(userId => userId !== currentUser.id)
    return (
      <View style={styles.opponentsContainer}>
        {userIds.map(userId => {
          const user = users.find(user => user.id === userId)
          const username = user ?
            (user.fullName || user.login || user.email) :
            ''
          const backgroundColor = user && user.color ?
            user.color :
            colors.primaryDisabled
          const peerState = peers[userId] || 0
          return (
            <View key={userId} style={styles.opponentView}>
              <View style={[styles.circleView, { backgroundColor }]}>
                <Text style={styles.circleText}>
                  {username.charAt(0)}
                </Text>
              </View>
              <Text style={styles.usernameText}>
                {username}
              </Text>
              <Text style={styles.statusText}>
                {PeerStateText[peerState]}
              </Text>
            </View>
          )
        })}
      </View>
    )
  }

  getVideoViews = () => {
    const { currentUser, opponentsLeftCall, session } = this.props
    if (session.type === QB.webrtc.RTC_SESSION_TYPE.VIDEO) {
      const opponentsIds = session
        .opponentsIds
        .concat(session.initiatorId)
        .filter(id =>
          opponentsLeftCall.indexOf(id) === -1 &&
          id !== currentUser.id
        )
      const videoStyle = opponentsIds.length > 1 ?
        { height: '50%', width: '50%' } :
        { height: '50%', width: '100%' }
      const myVideoStyle = opponentsIds.length > 2 ?
        { height: '50%', width: '50%' } :
        { height: '50%', width: '100%' }
      return (
        <React.Fragment>
          {opponentsIds.map(userId => (
            <WebRTCView
              key={userId}
              sessionId={session.id}
              style={videoStyle}
              userId={userId}
            />
          ))}
          {this.state.muteVideo ? (
            <View style={[myVideoStyle, { backgroundColor: colors.black }]} />
          ) : (
            <WebRTCView
              key={currentUser.id}
              mirror
              sessionId={session.id}
              style={myVideoStyle}
              userId={currentUser.id}
            />
          )}
        </React.Fragment>
      )
    } else {
      return this.getOpponentsCircles()
    }
  }

  getButtons = () => {
    const { loudspeaker, muteAudio, muteVideo } = this.state
    const { session } = this.props
    return (
      <View style={styles.buttons}>
        <CallScreenButton
          buttonStyle={muteAudio ? styles.buttonActive : undefined}
          image={Icons.MIC_OFF}
          imageStyle={muteAudio ? styles.buttonImageActive : undefined}
          onPress={this.toggleAudio}
          text={muteAudio ? 'Unmute' : 'Mute'}
        />
        {session.type === QB.webrtc.RTC_SESSION_TYPE.VIDEO ? (
          <CallScreenButton
            buttonStyle={muteVideo ? styles.buttonActive : undefined}
            image={Icons.CAM_OFF}
            imageStyle={muteVideo ? styles.buttonImageActive : undefined}
            onPress={this.toggleVideo}
            text={muteVideo ? 'Camera off' : 'Camera on'}
          />
        ) : null}
        {session.type === QB.webrtc.RTC_SESSION_TYPE.VIDEO ? (
          <CallScreenButton
            onPress={this.switchCamera}
            image={Icons.SWITCH_CAMERA}
            text="Swap cam"
          />
        ) : null}
        <CallScreenButton
          image={Icons.CALL_END}
          buttonStyle={{ backgroundColor: colors.redBackground }}
          onPress={this.callEndHandler}
          text="End call"
        />
        {session.type === QB.webrtc.RTC_SESSION_TYPE.AUDIO ? (
          <CallScreenButton
            buttonStyle={loudspeaker ? styles.buttonActive : undefined}
            image={Icons.SPEAKER}
            imageStyle={loudspeaker ? styles.buttonImageActive : undefined}
            onPress={this.switchAudioOutput}
            text={loudspeaker ? 'Speaker' : 'Mic'}
          />
        ) : null}
      </View>
    )
  }

  callScreen = () => {
    return (
      <View style={styles.videosContainer}>
        {this.getVideoViews()}
        {this.getButtons()}
      </View>
    )
  }

  dialingScreen = () => {
    const { caller, session } = this.props
    if (!session) return null
    let username = ''
    if (caller) {
      username = caller.fullName || caller.login || caller.email
    }
    const circleBackground = {
      backgroundColor: caller && caller.color ?
        caller.color :
        colors.primaryDisabled
    }
    return (
      <View style={{ flex: 1, width: '100%' }}>
        {this.isIncomingCall ? (
          <View style={styles.opponentsContainer}>
            <View style={[styles.opponentView, { width: '100%' }]}>
              <View style={[styles.circleView, circleBackground]}>
                <Text style={styles.circleText}>
                  {username.charAt(0)}
                </Text>
              </View>
              <Text numberOfLines={1} style={styles.usernameText}>
                {username}
              </Text>
              <Text style={styles.statusText}>
                Calling...
              </Text>
            </View>
          </View>
        ) : this.getOpponentsCircles()}
        <View style={styles.buttons}>
          <CallScreenButton
            buttonStyle={{ backgroundColor: colors.redBackground }}
            image={Icons.CALL_END}
            onPress={this.callEndHandler}
            text={this.isIncomingCall ? 'Decline' : 'End call'}
          />
          {this.isIncomingCall ? (
            <CallScreenButton
              buttonStyle={{ backgroundColor: colors.lightGreen }}
              image={session.type === QB.webrtc.RTC_SESSION_TYPE.AUDIO ?
                Icons.CALL_ACCEPT :
                Icons.VIDEO_ACCEPT
              }
              onPress={this.acceptHandler}
              text="Accept"
            />
          ) : null}
        </View>
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={styles.container.backgroundColor} />
        {this.props.onCall ? this.callScreen() : this.dialingScreen()}
      </SafeAreaView>
    )
  }

}