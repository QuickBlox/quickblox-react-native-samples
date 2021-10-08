import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {enableScreens} from 'react-native-screens';

import App from './App';
import SplashScreen from './components/SplashScreen';
import {setupPushNotifications} from './NotificationService';
import configureStore from './store';
import rootSaga from './sagas';

const {runSaga, store, persistor} = configureStore();
runSaga(rootSaga);
enableScreens(false);
setupPushNotifications();

export default () => (
  <Provider store={store}>
    <PersistGate loading={<SplashScreen />} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
