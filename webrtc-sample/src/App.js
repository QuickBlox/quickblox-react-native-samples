import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createStructuredSelector} from 'reselect';
import QB from 'quickblox-react-native-sdk';

import Navigator from './Navigation';
import {
  appStart,
  chatConnectAndSubscribe,
  createPushSubscription,
} from './actionCreators';
import {
  appReadySelector,
  authLoggedInSelector,
  authUserSelector,
  webrtcSessionSelector,
} from './selectors';
import {colors} from './theme';
import config from './QBConfig';

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
});

const selector = createStructuredSelector({
  appReady: appReadySelector,
  call:  webrtcSessionSelector,
  loggedIn: authLoggedInSelector,
  user: authUserSelector,
});

export default function App() {
  const dispatch = useDispatch();
  const {appReady, call, loggedIn, user} = useSelector(selector);

  React.useLayoutEffect(() => {
    if (!appReady) {
      dispatch(appStart(config));
    }
  }, []);

  React.useEffect(() => {
    if (appReady) {
      if (user) {
        dispatch(chatConnectAndSubscribe());
        const channel =
          Platform.OS === 'ios'
            ? QB.subscriptions.PUSH_CHANNEL.APNS_VOIP
            : undefined;
        dispatch(createPushSubscription(channel));
      }
    }
  }, [appReady, dispatch, user]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <SafeAreaProvider style={styles.navigatorView}>
        <Navigator appReady={appReady} call={call} loggedIn={loggedIn} />
      </SafeAreaProvider>
      <FlashMessage position="bottom" />
    </View>
  );
}
