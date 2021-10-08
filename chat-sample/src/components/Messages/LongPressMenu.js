import React from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';
import QB from 'quickblox-react-native-sdk';

import {colors} from '../../theme';

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    height: '100%',
    width: '100%',
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
  menuView: {
    backgroundColor: colors.white,
    borderRadius: 14,
    elevation: 5,
    minWidth: 150,
    position: 'absolute',
    shadowColor: colors.gray,
    shadowOffset: {height: 4, width: 4},
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  moreBtn: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
});

const MESSAGE_INPUT_HEIGHT = 42;
const ANIMATION_DURATION = 250;
const ITEM_HEIGHT = 42;

function LongPressMenu(props) {
  const {
    children,
    dialogType,
    messageIsMine = false,
    onDeliveredPress,
    onForwardPress,
    onViewedPress,
    stickToLeft = false,
  } = props;

  const [state, setState] = React.useState({
    left: undefined,
    show: false,
    top: undefined,
  });
  const _width = 150;
  const scale = React.useRef(new Animated.Value(0)).current;
  const headerHeight = useHeaderHeight();

  const forwardPressHandler = () => {
    onForwardPress && onForwardPress();
    hideMenu();
  };

  const deliveredPressHandler = () => {
    onDeliveredPress && onDeliveredPress();
    hideMenu();
  };

  const viewedPressHandler = () => {
    onViewedPress && onViewedPress();
    hideMenu();
  };

  const menuItems = [
    <TouchableOpacity
      key="forward"
      onPress={forwardPressHandler}
      style={styles.menuItemBtn}>
      <Text style={styles.menuItemText}>Forward</Text>
    </TouchableOpacity>,
  ];
  if (dialogType === QB.chat.DIALOG_TYPE.GROUP_CHAT && messageIsMine) {
    menuItems.push(
      <TouchableOpacity
        key="delivered"
        onPress={deliveredPressHandler}
        style={styles.menuItemBtn}>
        <Text style={styles.menuItemText}>Delivered to...</Text>
      </TouchableOpacity>,
      <TouchableOpacity
        key="viewed"
        onPress={viewedPressHandler}
        style={styles.menuItemBtn}>
        <Text style={styles.menuItemText}>Viewed by...</Text>
      </TouchableOpacity>,
    );
  }
  const _height = ITEM_HEIGHT * menuItems.length;

  const showMenu = React.useCallback(
    e => {
      const SCREEN = Dimensions.get('window');
      e.target.measure((x, y, width, height, pageX, pageY) => {
        const bottomOfMessage = pageY + height;
        const centerOfMessage = pageX + width / 2 - _width / 2;
        let top = bottomOfMessage;
        let left = centerOfMessage;
        if (bottomOfMessage + _height > SCREEN.height - MESSAGE_INPUT_HEIGHT) {
          top = pageY - _height;
          if (top < headerHeight) {
            top = pageY + height / 2 - _height / 2;
          }
        }
        if (_width > width * 1.2) {
          left = stickToLeft ? pageX : pageX - (_width - width);
        }
        setState({left, show: true, top});
        Animated.timing(scale, {
          duration: ANIMATION_DURATION,
          toValue: 1,
          useNativeDriver: true,
        }).start();
      });
    },
    [headerHeight, _height, scale, stickToLeft],
  );

  const hideMenu = React.useCallback(() => {
    if (state.show) {
      Animated.timing(scale, {
        duration: ANIMATION_DURATION,
        toValue: 0,
        useNativeDriver: true,
      }).start(() => setState({show: false}));
      return true;
    } else {
      return false;
    }
  }, [scale, state.show]);

  React.useEffect(() => {
    const backListener = BackHandler.addEventListener(
      'hardwareBackPress',
      hideMenu,
    );
    return backListener.remove;
  }, [hideMenu]);

  const layoutHandler = e => {
    const {height, width} = e.nativeEvent.layout;
    this.height = height;
    this.width = width;
  };

  const {left, show, top} = state;
  const menuStyle = [
    styles.menuView,
    {
      left,
      opacity: scale,
      top,
      transform: [{scale}],
    },
  ];
  return (
    <React.Fragment>
      <Pressable onLongPress={showMenu}>
        {React.Children.map(children, child =>
          React.isValidElement(child)
            ? React.cloneElement(child, {onLongPress: showMenu})
            : null,
        )}
      </Pressable>
      <Modal
        animationType="none"
        hardwareAccelerated
        onRequestClose={hideMenu}
        supportedOrientations={['landscape', 'portrait']}
        transparent
        visible={show}>
        <Animated.View
          onStartShouldSetResponder={() => true}
          onResponderRelease={hideMenu}
          style={[styles.backdrop, {opacity: scale}]}>
          <Animated.View onLayout={layoutHandler} style={menuStyle}>
            {menuItems}
          </Animated.View>
        </Animated.View>
      </Modal>
    </React.Fragment>
  );
}

export default React.memo(LongPressMenu);
