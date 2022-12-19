import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import App from './App';
import SplashScreen from './components/SplashScreen';
import configureStore from './store';
import rootSaga from './sagas';
import {setupPushNotifications} from './NotificationService';

setupPushNotifications();

// eslint-disable-next-line no-undef
globalThis.ANSWER_TIME_INTERVAL = 30;

const {runSaga, store, persistor} = configureStore();
runSaga(rootSaga);

export default () => (
  <Provider store={store}>
    <PersistGate loading={<SplashScreen />} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
