import {applyMiddleware, compose, createStore} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import storage from '@react-native-async-storage/async-storage';
import createSagaMiddleware from 'redux-saga';
import {createLogger} from 'redux-logger';

import rootReducer from '../reducers';
import * as actionCreators from '../actionCreators';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];
if (__DEV__) {
  const stateTransformer = state => state;
  // uncomment to return only part of the store
  /* const stateTransformer = state => ({
    app: state.app,
    auth: state.auth,
    chat: state.chat,
    device: state.device,
  }); */
  middlewares.push(createLogger({stateTransformer}));
}

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'device'],
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
