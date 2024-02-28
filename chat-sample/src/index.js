import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {enableScreens} from 'react-native-screens';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import App from './App';
import SplashScreen from './components/SplashScreen';
import {setupPushNotifications} from './NotificationService';
import configureStore from './store';
import rootSaga from './sagas';

const {runSaga, store, persistor} = configureStore();
runSaga(rootSaga);
enableScreens(false);
setupPushNotifications();

export default function Root() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <PersistGate loading={<SplashScreen />} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
