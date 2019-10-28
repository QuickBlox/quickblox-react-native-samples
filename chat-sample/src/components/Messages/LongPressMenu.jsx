import React from 'react'
import {
  Animated,
  BackHandler,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  UIManager,
} from 'react-native'
import { Header } from 'react-navigation-stack'
import QB from 'quickblox-react-native-sdk'

import { colors } from '../../theme'

const styles = StyleSheet.create({
  moreBtn: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
    minWidth: 150,
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

const MESSAGE_INPUT_HEIGHT = 42

export default class LongPressMenu extends React.Component {

  ANIMATION_DURATION = 250
  state = {
    left: undefined,
    show: false,
    top: undefined,
  }
  itemHeight = 42
  width = 150
  scale = new Animated.Value(0)
  backListener

  constructor(props) {
    super(props)
    const { dialogType } = props
    this.menuItems = [(
      <TouchableOpacity
        key="forward"
        onPress={this.forwardPressHandler}
        style={styles.menuItemBtn}
      >
        <Text style={styles.menuItemText}>Forward</Text>
      </TouchableOpacity>
    )]
    if (dialogType === QB.chat.DIALOG_TYPE.GROUP_CHAT) {
      this.menuItems.push((
        <TouchableOpacity
          key="delivered"
          onPress={this.deliveredPressHandler}
          style={styles.menuItemBtn}
        >
          <Text style={styles.menuItemText}>Delivered to...</Text>
        </TouchableOpacity>
      ), (
        <TouchableOpacity
          key="viewed"
          onPress={this.viewedPressHandler}
          style={styles.menuItemBtn}
        >
          <Text style={styles.menuItemText}>Viewed by...</Text>
        </TouchableOpacity>
      ))
    }
    this.height = this.itemHeight * this.menuItems.length
  }

  componentDidMount() {
    this.backListener = BackHandler
      .addEventListener('hardwareBackPress', this.hideMenu)
  }

  componentWillUnmount() {
    this.backListener.remove()
  }

  layoutHandler = e => {
    const { height, width } = e.nativeEvent.layout
    this.height = height
    this.width = width
  }

  showMenu = e => {
    const { stickToLeft = false } = this.props
    const SCREEN = Dimensions.get('window')
    UIManager.measure(e.target, (x, y, width, height, pageX, pageY) => {
      const bottomOfMessage = pageY + height
      const centerOfMessage = pageX + width / 2 - this.width / 2
      let top = bottomOfMessage
      let left = centerOfMessage
      if (bottomOfMessage + this.height > SCREEN.height - MESSAGE_INPUT_HEIGHT) {
        top = pageY - this.height
        if (top < Header.HEIGHT) {
          top = pageY + height / 2 - this.height / 2
        }
      }
      if (this.width > width * 1.2) {
        left = stickToLeft ? pageX : pageX - (this.width - width)
      }
      this.setState({ show: true, top, left }, () => Animated
        .timing(this.scale, {
          duration: this.ANIMATION_DURATION,
          toValue: 1,
          useNativeDriver: true
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

  forwardPressHandler = () => {
    if (this.props.onForwardPress) {
      this.props.onForwardPress()
    }
    this.hideMenu()
  }

  deliveredPressHandler = () => {
    if (this.props.onDeliveredPress) {
      this.props.onDeliveredPress()
    }
    this.hideMenu()
  }

  viewedPressHandler = () => {
    if (this.props.onViewedPress) {
      this.props.onViewedPress()
    }
    this.hideMenu()
  }

  render() {
    const { left, show, top } = this.state
    const menuStyle = [styles.menuView, {
      opacity: this.scale,
      left,
      top,
      transform: [{ scale: this.scale }],
    }]
    return (
      <React.Fragment>
        <TouchableWithoutFeedback onLongPress={this.showMenu}>
          {React.cloneElement(
            this.props.children,
            { onLongPress: this.showMenu }
          )}
        </TouchableWithoutFeedback>
        <Modal
          animationType="none"
          onRequestClose={this.hideMenu}
          supportedOrientations={['landscape', 'portrait']}
          transparent
          visible={show}
        >
          <Animated.View
            onStartShouldSetResponder={() => true}
            onResponderRelease={this.hideMenu}
            style={[styles.backdrop, { opacity: this.scale }]}
          >
            <Animated.View onLayout={this.layoutHandler} style={menuStyle}>
              {this.menuItems}
            </Animated.View>
          </Animated.View>
        </Modal>
      </React.Fragment>
    )
  }

}