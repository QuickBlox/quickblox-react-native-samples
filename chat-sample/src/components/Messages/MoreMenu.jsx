import React from 'react'
import {
  Animated,
  BackHandler,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native'
import QB from 'quickblox-react-native-sdk'

import { colors } from '../../theme'
import { MORE } from '../../images'

const styles = StyleSheet.create({
  moreBtn: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  backdrop: {
    backgroundColor: colors.transparent,
    bottom: 0,
    height: '100%',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
  },
  menuView: {
    backgroundColor: colors.white,
    borderRadius: 14,
    elevation: 5,
    minWidth: 146,
    position: 'absolute',
    shadowColor: colors.gray,
    shadowOffset: { height: 4, width: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  menuItemBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemText: {
    color: colors.black,
    fontSize: 15,
    lineHeight: 18,
  },
})

export default class MoreMenu extends React.Component {

  ANIMATION_DURATION = 250
  state = {
    right: undefined,
    show: false,
    top: undefined,
  }
  scale = new Animated.Value(0)
  backListener

  componentDidMount() {
    this.backListener = BackHandler
      .addEventListener('hardwareBackPress', this.hideMenu)
  }

  componentWillUnmount() {
    this.backListener.remove()
  }

  showMenu = e => {
    UIManager.measure(e.target, (x, y, width, height, pageX, pageY) => {
      this.setState({
        show: true,
        top: pageY + height,
        right: width / 2
      }, () => Animated
        .timing(this.scale, {
          duration: this.ANIMATION_DURATION,
          toValue: 1,
          useNativeDriver: true,
        })
        .start()
      )
    })
  }

  hideMenu = () => {
    if (this.state.show) {
      Animated
        .timing(this.scale, {
          duration: this.ANIMATION_DURATION,
          toValue: 0,
          useNativeDriver: true
        })
        .start(() => this.setState({ show: false }))
      return true
    } else {
      return false
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.show !== nextState.show
  }

  infoPressHandler = () => {
    if (this.props.onInfoPress) {
      this.props.onInfoPress()
    }
    this.hideMenu()
  }

  leavePressHandler = () => {
    if (this.props.onLeavePress) {
      this.props.onLeavePress()
    }
    this.hideMenu()
  }

  render() {
    const { right, show, top } = this.state
    const menuStyle = [styles.menuView, {
      opacity: this.scale,
      right,
      top,
      transform: [
        { scale: this.scale },
        { perspective: 1000 }
      ],
    }]
    const showInfoBtn = (
      this.props.dialogType === QB.chat.DIALOG_TYPE.GROUP_CHAT
    )
    return (
      <React.Fragment>
        <TouchableOpacity
          onPress={this.showMenu}
          style={styles.moreBtn}
        >
          <Image
            resizeMode="center"
            source={MORE}
            style={{ height: 28, width: 28 }}
          />
        </TouchableOpacity>
        <Modal
          animationType="none"
          onRequestClose={this.hideMenu}
          supportedOrientations={['landscape', 'portrait']}
          transparent
          visible={show}
        >
          <View
            onStartShouldSetResponder={() => true}
            onResponderRelease={this.hideMenu}
            style={styles.backdrop}
          >
            <Animated.View style={menuStyle}>
              {showInfoBtn ? (
                <TouchableOpacity
                  onPress={this.infoPressHandler}
                  style={styles.menuItemBtn}
                >
                  <Text style={styles.menuItemText}>Group Info</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                onPress={this.leavePressHandler}
                style={styles.menuItemBtn}
              >
                <Text style={styles.menuItemText}>Leave Chat</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      </React.Fragment>
    )
  }

}