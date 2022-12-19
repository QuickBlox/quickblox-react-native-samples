import {applyMiddleware, compose, createStore} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from '@react-native-async-storage/async-storage';
import createSagaMiddleware from 'redux-saga';
import {createLogger} from 'redux-logger';

import rootReducer from '../reducers';
import * as actionCreators from '../actionCreators';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];
if (__DEV__) {
  const stateTransformer = state => state;
  middlewares.push(createLogger({stateTransformer}));
}

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['auth', 'device', 'pushNotifications'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
let store;

export default function configureStore(preloadedState) {
  const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({actionCreators})
      : compose;

  const enhancer = composeEnhancers(applyMiddleware(...middlewares));

  store = createStore(persistedReducer, preloadedState, enhancer);
  const persistor = persistStore(store);
  return {
    persistor,
    runSaga: sagaMiddleware.run,
    store,
  };
}

export {store};
