import React from 'react';
import {
  Animated,
  BackHandler,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import QB from 'quickblox-react-native-sdk';

import {colors} from '../../theme';
import {MORE} from '../../images';

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.transparent,
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
    minWidth: 146,
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
  moreBtnIcon: {
    tintColor: colors.white,
    height: 28,
    width: 28,
  },
});

const ANIMATION_DURATION = 250;

function MoreMenu(props) {
  const {dialogType, onInfoPress, onLeavePress} = props;

  const [state, setState] = React.useState({
    right: undefined,
    show: false,
    top: undefined,
  });
  const scale = React.useRef(new Animated.Value(0)).current;
  const buttonRef = React.useRef(null);

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

  const showMenu = () => {
    if (!buttonRef.current) {
      return;
    }
    buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
      setState({
        right: width / 2,
        show: true,
        top: pageY + height,
      });
      Animated.timing(scale, {
        duration: ANIMATION_DURATION,
        toValue: 1,
        useNativeDriver: true,
      }).start();
    });
  };

  const infoPressHandler = () => {
    onInfoPress && onInfoPress();
    hideMenu();
  };

  const leavePressHandler = () => {
    onLeavePress && onLeavePress();
    hideMenu();
  };

  const {right, show, top} = state;
  const menuStyle = [
    styles.menuView,
    {
      opacity: scale,
      right,
      top,
      transform: [{scale: scale}, {perspective: 1000}],
    },
  ];
  const showInfoBtn = dialogType === QB.chat.DIALOG_TYPE.GROUP_CHAT;
  const isPrivateChat = dialogType === QB.chat.DIALOG_TYPE.CHAT;
  return (
    <React.Fragment>
      <Pressable onPress={showMenu} ref={buttonRef} style={styles.moreBtn}>
        <Image resizeMode="center" source={MORE} style={styles.moreBtnIcon} />
      </Pressable>
      <Modal
        animationType="none"
        onRequestClose={hideMenu}
        supportedOrientations={['landscape', 'portrait']}
        transparent
        visible={show}>
        <View
          onStartShouldSetResponder={() => true}
          onResponderRelease={hideMenu}
          style={styles.backdrop}>
          <Animated.View style={menuStyle}>
            {showInfoBtn ? (
              <Pressable onPress={infoPressHandler} style={styles.menuItemBtn}>
                <Text style={styles.menuItemText}>Chat Info</Text>
              </Pressable>
            ) : null}
            <Pressable onPress={leavePressHandler} style={styles.menuItemBtn}>
              <Text style={styles.menuItemText}>
                {isPrivateChat ? 'Delete' : 'Leave'} Chat
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
    </React.Fragment>
  );
}

export default React.memo(MoreMenu);
